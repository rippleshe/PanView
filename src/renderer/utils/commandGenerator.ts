import type { SelectedParam } from '../types/app'

export interface CommandPart {
  type: 'command' | 'input' | 'output' | 'flag' | 'option' | 'variable'
  text: string
  param?: SelectedParam
}

export function parseCommand(
  inputFile: string,
  outputFile: string,
  params: SelectedParam[],
  variables?: Record<string, string>
): CommandPart[] {
  const parts: CommandPart[] = []

  parts.push({ type: 'command', text: 'pandoc' })
  parts.push({ type: 'input', text: `"${inputFile}"` })
  parts.push({ type: 'output', text: '-o' })
  parts.push({ type: 'output', text: `"${outputFile}"` })

  for (const param of params) {
    const p = param.param
    const value = param.value

    if (p.type === 'boolean' && value === true) {
      parts.push({ type: 'flag', text: p.name, param })
    } else if (p.type === 'string' && value) {
      parts.push({ type: 'option', text: p.name, param })
      parts.push({ type: 'option', text: `"${value}"`, param })
    } else if (p.type === 'number' && value !== undefined) {
      parts.push({ type: 'option', text: `${p.name}=${value}`, param })
    } else if (p.type === 'path' && value) {
      parts.push({ type: 'option', text: p.name, param })
      parts.push({ type: 'option', text: `"${value}"`, param })
    } else if (p.type === 'select' && value) {
      parts.push({ type: 'option', text: `${p.name}=${value}`, param })
    }
  }

  if (variables) {
    for (const [key, val] of Object.entries(variables)) {
      if (val) {
        parts.push({ type: 'variable', text: `--variable="${key}:${val}"` })
      }
    }
  }

  return parts
}

export function formatCommandPreview(command: string): string {
  const maxLength = 80
  if (command.length <= maxLength) {
    return command
  }

  const parts = command.split(' ')
  let result = parts[0]
  let currentLine = result

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]
    if (currentLine.length + part.length + 1 > maxLength) {
      result += '\n            ' + part
      currentLine = part
    } else {
      result += ' ' + part
      currentLine += ' ' + part
    }
  }

  return result
}

export function generatePandocCommand(
  inputFile: string,
  outputFile: string,
  params: SelectedParam[],
  variables?: Record<string, string>
): string {
  let command = `pandoc "${inputFile}" -o "${outputFile}"`

  for (const param of params) {
    const p = param.param
    const value = param.value

    if (p.type === 'boolean' && value === true) {
      command += ` ${p.name}`
    } else if (p.type === 'string' && value) {
      command += ` ${p.name}="${value}"`
    } else if (p.type === 'number' && value !== undefined) {
      command += ` ${p.name}=${value}`
    } else if (p.type === 'path' && value) {
      command += ` ${p.name}="${value}"`
    } else if (p.type === 'select' && value) {
      command += ` ${p.name}=${value}`
    }
  }

  if (variables) {
    for (const [key, val] of Object.entries(variables)) {
      if (val) {
        command += ` --variable="${key}:${val}"`
      }
    }
  }

  return command
}

export function getFileNameWithoutExtension(filePath: string): string {
  const fileName = filePath.split(/[/\\]/).pop() || ''
  return fileName.replace(/\.[^/.]+$/, '')
}

export function getFileExtension(filePath: string): string {
  const parts = filePath.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

export function isPathValid(path: string): boolean {
  return path.length > 0 && !path.includes('*') && !path.includes('?')
}
