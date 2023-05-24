import request from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  interfaceList: '/interfaceInfo/list/page/vo',
  updateInterface: '/interfaceInfo/update',
  saveInterface: '/interfaceInfo/save',
  deleteInterface: '/interfaceInfo/delete',
  onlineInterface: '/interfaceInfo/online',
  offlineInterface: '/interfaceInfo/offline',
  getInterfaceDetail: '/interfaceInfo/get/vo',
  invokInface: '/interfaceInfo/invoke',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getInterfaceList (parameter) {
  return request({
    url: api.interfaceList,
    method: 'post',
    data: parameter
  })
}
export function updateInterface (parameter) {
  return request({
    url: api.updateInterface,
    method: 'post',
    data: parameter
  })
}
export function saveInterface (parameter) {
  return request({
    url: api.saveInterface,
    method: 'post',
    data: parameter
  })
}
export function deleteInterface (parameter) {
  return request({
    url: api.deleteInterface,
    method: 'post',
    data: parameter
  })
}
export function onlineInterface (parameter) {
  return request({
    url: api.onlineInterface,
    method: 'post',
    data: parameter
  })
}
export function offlineInterface (parameter) {
  return request({
    url: api.offlineInterface,
    method: 'post',
    data: parameter
  })
}

export function getInterfaceDetail (parameter) {
  return request({
    url: api.getInterfaceDetail,
    method: 'get',
    params: parameter
  })
}

export function invokInface (parameter) {
  return request({
    url: api.invokInface,
    method: 'post',
    data: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}
