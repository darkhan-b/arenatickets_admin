import { tokenService } from '@/services/token.service'

export default ({ next }: { next: any }) => {
  if (!tokenService.getToken()) return next('/login')

  return next()
}
