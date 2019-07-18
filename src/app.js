import React, { Component } from 'react';
import {BrowserRouter as Router,Switch,Redirect,Route,Link} from 'react-router-dom';
import Home from './page/home';
import Layout from './component/layout';
// import DataMarket from './page/data/data-market'
// import DataStore from './page/data/data-store'
// import Goodssuyuancheng from './page/data/data-suyuancheng'
import ProductPro from './page/product/product-product'
import ProductGoods from './page/product/product-provider'
import Plu from './page/data/plu'
import AddPlu from './page/data/plu/index1'
import Login from './page/login'
import Trading from './page/trade/trading'
import TradeItem from './page/trade/trade-item'
import AuthRouter from './component/authRouter'
import NotFound from './page/404'
import axios from 'axios'
import User from './page/user'
import MarketAdmin from './page/user/market-admin/index.js'
export default class App extends Component{
  constructor(props){
    super(props);
    this.state={
      role:"",
      roleArray:['Admin','storeAdmin']
    }
  }

  render(){
    return (
      <Router>
        <div>
        <AuthRouter/>
        <Switch>
            <Route path="/login"  component={Login}/>
            <Route path="/info"  render={props=>(<Layout>
              <Switch>
                <Route path="/info"  exact component={Home}/>
                <Route path="/info/user-admin"  component={User}/>
                <Route path="/info/user-market-admin/:id" component={MarketAdmin} />
                {/* <Route path="/info/data-market"  component={DataMarket}/>
                <Route path="/info/data-store/"  component={DataStore}/>
                <Route path="/info/data-suyuancheng"  component={Goodssuyuancheng}/> */}
                <Route path="/info/data-suyuancheng-plu/:id"  component={Plu}/>
                <Route path="/info/data-suyuancheng-add-plu/:id"  component={AddPlu}/>
                <Route path="/info/product-product"  component={ProductPro}/>
                <Route path="/info/product-provider"  component={ProductGoods}/>
                <Route path="/info/deal-register"  component={Home}/>
                <Route path="/info/deal-query"  component={Home}/>
                <Route path="/info/trade"  component={Trading}/>
                <Route path="/info/trading-item/:id"  component={TradeItem}/>
                <Route path="/info/404"  component={NotFound}/>
                <Redirect to= "/info/404"/>
              </Switch>
        </Layout> )}/>
            {/* <Redirect to= "/login"/> */}
        </Switch>
        </div>
      </Router>
    )
  }
}