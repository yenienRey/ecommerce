import axios from "axios";
import {log, success} from '../utils/logs'

export const setOrder = (order) => ({
  type: "SET_ORDER",
  payload: order,
});

export const setOrderAdress = (address) => ({
  type: "SET_ORDER_ADDRESS",
  payload: address,
});

export const resetOrder = () => ({
  type: "RESET_ORDER"
})

export const getOrder = () => (dispatch, getState) => {
  axios.get(`/api/orders/${getState().users.user.id}`)
    .then((res) => dispatch(setOrder(res.data)))
    .catch((err) => console.log(err))
}

export const postOrder = (id) => (dispatch) => {
  log("postOrder in cartActionCreators:18")
  axios.post(`http://localhost:8000/api/orders/new`, {userId: id})
    .then(({data}) => dispatch(setOrder(data))).then(() => success('orden creada con exito.', ""))
    .catch((err) => console.log(err))
}

export const setAdress = (address) => (dispatch, getState) => {
  dispatch(setOrderAdress(address))
}

