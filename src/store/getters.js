const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  seatId: state => state.user.seatId,
  seatPw: state => state.user.seatPw,
  bindTel: state => state.user.bindTel,
  userId: state => state.user.userId,
  telephone: state => state.user.telephone
}
export default getters
