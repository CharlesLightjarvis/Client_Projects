import { useFileUpload } from './use-file-upload'

interface UseFormFileUploadProps {
  accept?: string
  maxSize?: number
}

export const useFormFileUpload = (props: UseFormFileUploadProps = {}) => {
  const {
    accept = 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp',
    maxSize = 10 * 1024 * 1024, // 10MB
  } = props

  const [
    { files, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      getFile,
    },
  ] = useFileUpload({
    accept,
    maxSize,
    multiple: false,
  })

  return {
    // State
    files,
    errors,

    // Actions
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
    removeFile,
    getInputProps,
    getFile,

    // Helper to get file for form submission
    getFormData: () => ({
      file: getFile(),
      hasFile: files.length > 0,
      clear: () => removeFile(files[0]?.id || ''),
    }),
  }
}
