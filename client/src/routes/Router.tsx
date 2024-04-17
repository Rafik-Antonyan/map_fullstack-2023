import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home/Home'
import { Sign } from '../pages/Sign/Sign'
import { Header } from '../components/Header/Header'
import { Auth } from '../components/Auth/Auth'
import { Restaurant } from '../pages/Restaurant/Restaurant'
import { SelectedRestaurant } from '../pages/SelectedRestaurant/SelectedRestaurant'
import { MyOrders } from '../pages/MyOrders/MyOrders'
import { VerifyEmail } from '../pages/VerifyEmail/VerifyEmail'
import { Verified } from '../components/Auth/Verified'

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* with header */}
        <Route path='/' element={<Header />}>
          <Route path='' element={<Home />} />
          <Route path='sign/:type' element={<Sign />} />
          <Route path='' element={<Auth />}>
            <Route path='restaurant/:orderID' element={<Restaurant />} />
            <Route path='restaurant/:orderID/:placeID' element={<SelectedRestaurant />} />
          </Route>
        </Route>
        {/* without header */}
        <Route path='/' element={<Auth />}>
          <Route path='/orders' element={<MyOrders />} />
          <Route path='' element={<Verified />}>
            <Route path='/verify' element={<VerifyEmail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
