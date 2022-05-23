import {request} from "@/network/request";


export function getCategory() {
  return request({
    url: 'api/goods',
    method: 'get'
  })
}

export function getCategoryGoods(order = 'sales', id = 0, page = 1) {
  return request({
    url: `api/goods?category_id=${id}&page=${page}&${order}=1`,
    method: 'get'
  })
}