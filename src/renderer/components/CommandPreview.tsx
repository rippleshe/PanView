import { Check, Copy, Terminal } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { OUTPUT_FORMATS } from '../utils/paramLibrary'

export function CommandPreview() {
  const { selectedFiles, inputFormat, outputFormat, outputFileName, outputPath, selectedParams } = useAppStore()
  const [copied, setCopied] = useState(false)

  const getCommand = (): string => {
    if (selectedFiles.length === 0) {
      return 'pandoc <input> -f <format> -t <format> -o <output>'
    }

    const inputFile = selectedFiles[0].split(/[/\\]/).pop() || ''

    // Determine output file name
    const formatOption = OUTPUT_FORMATS.find(f => f.value === outputFormat)
    const ext = formatOption?.extension || outputFormat
    const baseName = outputFileName
      ? outputFileName
      : inputFile.replace(/\.[^.]+$/, `.${ext}`)
    const outFile = outputPath ? `${outputPath}\\${baseName}` : baseName

    // Build base command
    const parts: string[] = [
      'pandoc',
      `"${inputFile}"`,
      `-f ${inputFormat}`,
      `-t ${outputFormat}`,
      `-o "${outFile}"`,
    ]

    // Append params using actual --param-name, matching executeConversion logic
    for (const sp of selectedParams) {
      const def = sp.param
      if (!def) continue
      const { name, type } = def
      const val = sp.value
      if (type === 'boolean') {
        if (val === true) parts.push(name)
      } else if (val !== undefined && val !== '') {
        if (type === 'number' || type === 'select') {
          parts.push(`${name}=${String(val)}`)
        } else {
          // string / path
          parts.push(`${name} "${String(val)}"`)
        }
      }
    }

    return parts.join(' ')
  }

  const handleCopy = async () => {
    const command = getCommand()
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const command = getCommand()
  const isEmpty = selectedFiles.length === 0

  return (
    <div className="px-4 py-3 animate-slide-up">
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary-500 rounded-lg blur-md opacity-20 animate-pulse-subtle" />
            <Terminal size={18} className="relative text-primary-500" />
          </div>
          <div className="flex-1 min-w-0 overflow-x-auto">
            <code className={`text-caption font-mono whitespace-nowrap block tracking-wide ${isEmpty ? 'text-text-muted' : 'text-text-secondary'}`}>
              {command}
            </code>
          </div>
          <button
            onClick={handleCopy}
            disabled={isEmpty}
            className="btn-ghost px-4 py-2 text-sm rounded-lg font-medium flex items-center gap-1.5 flex-shrink-0 hover:text-primary-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check size={14} className="text-success" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>复制</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
