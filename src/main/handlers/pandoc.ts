import { execFile, spawn } from 'child_process'
import { existsSync } from 'fs'
import { ipcMain } from 'electron'
import Store from 'electron-store'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

interface PandocInfo {
  version: string
  path: string
  available: boolean
  source: 'custom' | 'system' | 'unknown'
  message?: string
}

const store = new Store()

interface ResolvedPandoc {
  executable: string
  source: 'custom' | 'system'
  customPath: string
}

interface ExecutePandocRequest {
  inputFile: string
  outputFile: string
  inputFormat: string
  outputFormat: string
  args: string[]
  pandocPath?: string
}

function getSavedPandocPath(): string {
  return String(store.get('pandocPath', '')).trim()
}

function resolvePandocExecutable(preferredPath?: string): ResolvedPandoc {
  const customPath = (preferredPath ?? getSavedPandocPath()).trim()
  if (customPath) {
    return {
      executable: customPath,
      source: 'custom',
      customPath
    }
  }

  return {
    executable: 'pandoc',
    source: 'system',
    customPath: ''
  }
}

function extractPandocVersion(output: string): string {
  const versionMatch = output.match(/pandoc\s+([0-9]+(?:\.[0-9]+){1,3})/i)
  return versionMatch ? versionMatch[1] : 'unknown'
}

async function checkPandoc(preferredPath?: string): Promise<PandocInfo> {
  const resolved = resolvePandocExecutable(preferredPath)

  if (resolved.source === 'custom' && !existsSync(resolved.executable)) {
    return {
      version: 'unknown',
      path: resolved.executable,
      available: false,
      source: 'custom',
      message: 'Pandoc 路径不存在，请重新选择可执行文件'
    }
  }

  try {
    const { stdout } = await execFileAsync(resolved.executable, ['--version'], {
      windowsHide: true
    })
    const version = extractPandocVersion(stdout)

    return {
      version,
      path: resolved.executable,
      available: true,
      source: resolved.source
    }
  } catch (error: any) {
    const fallbackMessage =
      resolved.source === 'custom'
        ? '无法运行指定的 Pandoc，请检查路径是否正确'
        : '未检测到系统 Pandoc，请在设置中导入 Pandoc 可执行文件路径'

    return {
      version: 'unknown',
      path: resolved.executable,
      available: false,
      source: resolved.source,
      message: error?.message || fallbackMessage
    }
  }
}

async function executePandoc(
  request: ExecutePandocRequest
): Promise<{ success: boolean; output: string; error: string }> {
  const resolved = resolvePandocExecutable(request.pandocPath)
  if (resolved.source === 'custom' && !existsSync(resolved.executable)) {
    return {
      success: false,
      output: '',
      error: 'Pandoc 路径不存在，请重新选择可执行文件'
    }
  }

  const baseArgs = [
    request.inputFile,
    '-f',
    request.inputFormat,
    '-t',
    request.outputFormat,
    '-o',
    request.outputFile
  ]
  const allArgs = [...baseArgs, ...request.args]

  return await new Promise((resolve) => {
    const child = spawn(resolved.executable, allArgs, {
      windowsHide: true
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk: Buffer | string) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString()
    })

    child.on('error', (error: Error) => {
      resolve({
        success: false,
        output: '',
        error: error.message
      })
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          output: stdout.trim(),
          error: stderr.trim()
        })
        return
      }

      resolve({
        success: false,
        output: stdout.trim(),
        error: stderr.trim() || `Pandoc 退出码: ${code}`
      })
    })
  })
}

function sanitizePandocArgs(args: string[]): string[] {
  return args.filter((item) => typeof item === 'string' && item.trim().length > 0)
}

function validateExecuteRequest(
  request: ExecutePandocRequest | null | undefined
): { valid: true; normalized: ExecutePandocRequest } | { valid: false; reason: string } {
  if (!request) {
    return { valid: false, reason: '缺少转换请求参数' }
  }

  const inputFile = request.inputFile?.trim()
  const outputFile = request.outputFile?.trim()
  const inputFormat = request.inputFormat?.trim()
  const outputFormat = request.outputFormat?.trim()

  if (!inputFile) {
    return { valid: false, reason: '缺少输入文件路径' }
  }
  if (!outputFile) {
    return { valid: false, reason: '缺少输出文件路径' }
  }
  if (!inputFormat) {
    return { valid: false, reason: '缺少输入格式' }
  }
  if (!outputFormat) {
    return { valid: false, reason: '缺少输出格式' }
  }

  return {
    valid: true,
    normalized: {
      inputFile,
      outputFile,
      inputFormat,
      outputFormat,
      args: sanitizePandocArgs(request.args || []),
      pandocPath: request.pandocPath?.trim() || undefined
    }
  }
}

export function registerPandocHandlers(): void {
  ipcMain.handle('pandoc:check', async (_, preferredPath?: string) => {
    return await checkPandoc(preferredPath)
  })

  ipcMain.handle('pandoc:execute', async (_, request: ExecutePandocRequest) => {
    const validation = validateExecuteRequest(request)
    if (!validation.valid) {
      return {
        success: false,
        output: '',
        error: validation.reason
      }
    }

    return await executePandoc(validation.normalized)
  })

  ipcMain.handle('pandoc:get-saved-path', async () => {
    return getSavedPandocPath()
  })

  ipcMain.handle('pandoc:set-path', async (_, path: string) => {
    store.set('pandocPath', (path || '').trim())
    return { success: true }
  })

  ipcMain.handle('pandoc:get-formats', async () => {
    const resolved = resolvePandocExecutable()

    if (resolved.source === 'custom' && !existsSync(resolved.executable)) {
      return {
        success: false,
        formats: [],
        error: 'Pandoc 路径不存在，请重新设置'
      }
    }

    try {
      const { stdout } = await execFileAsync(resolved.executable, ['--list-output-formats'], {
        windowsHide: true
      })
      const formats = stdout.split('\n').filter(f => f.trim())
      return { success: true, formats }
    } catch (error) {
      return { success: false, formats: [], error: '获取输出格式失败，请检查 Pandoc 路径' }
    }
  })
}
