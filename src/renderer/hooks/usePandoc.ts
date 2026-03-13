import { useState, useCallback } from 'react'
import { useAppStore } from '../stores/useAppStore'

export function usePandoc() {
  const { checkPandoc, pandocInfo, isConverting, conversionResult, executeConversion } = useAppStore()
  const [isChecking, setIsChecking] = useState(false)

  const checkPandocAvailability = useCallback(async () => {
    setIsChecking(true)
    try {
      await checkPandoc()
    } finally {
      setIsChecking(false)
    }
  }, [checkPandoc])

  const convert = useCallback(async () => {
    await executeConversion()
  }, [executeConversion])

  return {
    pandocInfo,
    isChecking,
    isConverting,
    conversionResult,
    checkPandoc: checkPandocAvailability,
    convert
  }
}
