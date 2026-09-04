import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function AdminRedirect() {
  const { t } = useTranslation();
  useEffect(() => {
    // Hard redirect to the static Studio build served from public/admin/
    // This avoids React Router trying to own the /admin route
    window.location.replace('/admin/index.html')
  }, [])
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-gray-600">
      {t('common.adminRedirect')}
    </div>
  )
}
