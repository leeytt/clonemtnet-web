const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.app.visitedViews,

  token: state => state.user.token,
  username: state => state.user.username,
  roleName: state => state.user.roleName,
  nickname: state => state.user.nickname,
  userId: state => state.user.userId,
  avatar: state => state.user.avatar,
  role: state => state.user.role,
  menus: state => state.user.menus,
  permissions: state => state.user.permissions,

  routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
