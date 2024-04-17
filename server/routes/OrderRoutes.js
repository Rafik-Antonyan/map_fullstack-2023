import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import { getPlaceById, getPlacesAroundMe, getPlacesAroundMeByOrderID, getUserOrders, newOrder, setOrder, updateOrderStatus } from "../controllers/OrderController.js";

const router = new Router

router.post("/newOrder", checkAuth, newOrder)

router.post("/getPlacesAroundMe", checkAuth, getPlacesAroundMe)

router.post("/getPlacesAroundMeByOrderId", checkAuth, getPlacesAroundMeByOrderID)

router.post("/getPlaceById", checkAuth, getPlaceById)

router.post("/setOrder", checkAuth, setOrder)

router.post("/getUserOrders", checkAuth, getUserOrders)

router.post("/updateOrderStatus", checkAuth, updateOrderStatus)

export default router