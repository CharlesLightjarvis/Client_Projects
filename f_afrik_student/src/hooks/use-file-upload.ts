import { useCallback, useRef, useState } from 'react'

export interface FileWithPreview {
  id: string
  file: File
  preview: string
}

export interface UseFileUploadOptions {
  accept?: string
  maxSize?: number
  multiple?: boolean
  onFilesSelected?: (files: FileWithPreview[]) => void
}

export interface UseFileUploadState {
  files: FileWithPreview[]
  isDragging: boolean
  errors: string[]
}

export interface UseFileUploadActions {
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  openFileDialog: () => void
  removeFile: (id: string) => void
  getInputProps: () => {
    type: 'file'
    accept: string
    multiple: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
  clearFiles: () => void
  getFile: () => File | null
  getFiles: () => File[]
}

export type UseFileUploadReturn = [UseFileUploadState, UseFileUploadActions]

export function useFileUpload(
  options: UseFileUploadOptions = {},
): UseFileUploadReturn {
  const {
    accept = '*',
    maxSize = 10 * 1024 * 1024, // 5MB par défaut
    multiple = false,
    onFilesSelected,
  } = options

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const validateFiles = useCallback(
    (filesToValidate: File[]): { valid: File[]; errors: string[] } => {
      const validFiles: File[] = []
      const newErrors: string[] = []

      for (const file of filesToValidate) {
        // Validation de la taille
        if (maxSize && file.size > maxSize) {
          const sizeMB = (maxSize / (1024 * 1024)).toFixed(1)
          newErrors.push(
            `Le fichier "${file.name}" est trop volumineux (max: ${sizeMB}MB)`,
          )
          continue
        }

        // Validation du type
        if (accept !== '*') {
          const acceptedTypes = accept.split(',').map((type) => type.trim())
          const fileType = file.type
          const fileExtension = `.${file.name.split('.').pop()}`

          const isAccepted = acceptedTypes.some((type) => {
            if (type.endsWith('/*')) {
              const baseType = type.replace('/*', '')
              return fileType.startsWith(baseType)
            }
            return type === fileType || type === fileExtension
          })

          if (!isAccepted) {
            newErrors.push(
              `Le type de fichier "${file.name}" n'est pas accepté`,
            )
            continue
          }
        }

        validFiles.push(file)
      }

      return { valid: validFiles, errors: newErrors }
    },
    [accept, maxSize],
  )

  const processFiles = useCallback(
    (filesToProcess: File[]) => {
      const { valid, errors: validationErrors } = validateFiles(filesToProcess)

      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }

      setErrors([])

      const filesWithPreview: FileWithPreview[] = valid.map((file) => {
        console.log('📁 Processing file in useFileUpload:', {
          name: file.name,
          type: file.type,
          size: file.size,
          isFile: file instanceof File,
        })
        return {
          id: Math.random().toString(36).substring(7),
          file, // IMPORTANT: on stocke le File object, pas le preview
          preview: URL.createObjectURL(file), // Le preview est juste pour l'affichage
        }
      })

      if (multiple) {
        setFiles((prev) => [...prev, ...filesWithPreview])
      } else {
        // Pour single file, nettoyer l'ancien preview
        files.forEach((f) => URL.revokeObjectURL(f.preview))
        setFiles(filesWithPreview)
      }

      console.log(
        '📤 Calling onFilesSelected with:',
        filesWithPreview.length,
        'files',
      )
      onFilesSelected?.(filesWithPreview)
    },
    [validateFiles, multiple, files, onFilesSelected],
  )

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      processFiles(droppedFiles)
    },
    [processFiles],
  )

  const openFileDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
    setErrors([])
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : []
      processFiles(selectedFiles)
      // Reset input value pour permettre de sélectionner le même fichier
      e.target.value = ''
    },
    [processFiles],
  )

  const getInputProps = useCallback(() => {
    return {
      ref: inputRef,
      type: 'file' as const,
      accept,
      multiple,
      onChange: handleInputChange,
    }
  }, [accept, multiple, handleInputChange])

  const clearFiles = useCallback(() => {
    setFiles((prevFiles) => {
      prevFiles.forEach((f) => URL.revokeObjectURL(f.preview))
      return []
    })
    setErrors([])
  }, [])

  const getFile = useCallback(() => {
    return files[0]?.file || null
  }, [files])

  const getFiles = useCallback(() => {
    return files.map((f) => f.file)
  }, [files])

  return [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      clearFiles,
      getFile,
      getFiles,
    },
  ]
}
