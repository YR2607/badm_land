import { useEffect } from 'react'

export default function AdminRedirect() {
  useEffect(() => {
    // Hard redirect to the static Studio build served from public/admin/
    // This avoids React Router trying to own the /admin route
    window.location.replace('/admin/index.html')
  }, [])
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-gray-600">
      Перенаправление в админку… Если не произошло автоматически, откройте
      {' '}<a href="/admin/index.html" className="text-primary-blue underline">/admin/index.html</a>
    </div>
  )
}
