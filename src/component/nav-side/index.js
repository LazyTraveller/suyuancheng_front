import React,{Component}from 'react'
import axios from 'axios'
import { Menu, Icon, Button } from 'antd';
import {Link,NavLink} from 'react-router-dom'
import "antd/dist/antd.css";
import './index.css'
import fun from '../../component/select/index'
const SubMenu = Menu.SubMenu;
export default class NavTop extends Component{
    constructor(props){
        super(props);
        this.state={
            role:"",
            collapsed: false,
        }
    }
    componentDidMount(){
        axios.get('/api/rest/user/user-info')
        .then(res=>{
           this.setState({
               role:fun.select(res.data.roles)
           })
        })
    }
    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      }
    render(){
        return (
            <div className=" navbar-side" style={{background: "#001529;"}}>
            <div className="sidebar-collapse"> 
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
            >
            <Menu.Item key="2">
            <Icon type="desktop" />
            <span>首页</span>
            <NavLink to="/info"></NavLink>
          </Menu.Item>
          {
                    ["ADMINISTRATOR"].indexOf(this.state.role)>=0?
            <SubMenu key="sub111" title={<span><Icon type="user" /><span>用户管理</span></span>}>
                
                    
                        <Menu.Item key="551">
                            <NavLink to="/info/user-admin">用户</NavLink>
                        </Menu.Item>
                       
                    
                </SubMenu> :null
          }
          <SubMenu key="sub1" title={<span><Icon type="database" /><span>数据管理</span></span>}>
            
                                {
                                    ["ADMINISTRATOR"].indexOf(this.state.role)>=0?
                                    <Menu.Item key="5j">
                                         <NavLink to="/info/data-market">市场</NavLink>
                                    </Menu.Item>
                                    :null
                                }
            
            
                {
                    ["MARKET_MANAGER","ADMINISTRATOR"].indexOf(this.state.role)>=0?
                    <Menu.Item key="55">
                        <NavLink to="/info/data-store" >商铺</NavLink>
                    </Menu.Item>
                        :null
                }
            <Menu.Item key="7"><NavLink to="/info/data-suyuancheng" >溯源秤</NavLink></Menu.Item>
          </SubMenu>
          <SubMenu key="sub23" title={<span><Icon type="cluster" /><span>商品管理</span></span>}>
            <Menu.Item key="58"><NavLink to="/info/product-product" >商品管理</NavLink></Menu.Item>
            <Menu.Item key="6"><NavLink to="/info/product-provider" >供应商管理</NavLink></Menu.Item>
          </SubMenu>

          <SubMenu key="sub3" title={<span><Icon type="area-chart" /><span>交易管理</span></span>}>
            <Menu.Item key="9"><NavLink to="/info/trade" >交易登记</NavLink></Menu.Item>
            
          </SubMenu>
         </Menu>
                {/* <ul className="nav">
                    <li>
                        <NavLink exact  to="/">
                            <i className="fa fa-dashboard"></i> 
                            <span>首页</span>  
                        </NavLink>
                    </li>
                    {
                        this.state.role==="ADMINISTRATOR"?<li className="active">
                        <Link to="/user-admin">
                            <i className="glyphicon glyphicon-user"></i> 
                            <span>用户管理</span>
                            <span className="fa arrow"></span>
                        </Link>
                            <ul className="nav nav-second-level collapse in">
                                <li>
                                    <NavLink to="/user-admin" >用户管理</NavLink>
                                </li>
                            </ul>
                    </li>:null
                    }
                    
                    <li className="active">
                        <Link to="/data-market">
                            <i className="glyphicon glyphicon-signal"></i> 
                            <span>基础数据管理</span>
                            <span className="fa arrow"></span>
                        </Link>
                            <ul className="nav nav-second-level collapse in">
                                
                               
                                
                                
                              
                            </ul>
                    </li>
                    <li className="active">
                        <NavLink to="/product-product">
                            <i className="fa fa-sitemap"></i> 
                            <span>商品管理</span>
                            <span className="fa arrow"></span>
                        </NavLink>
                            <ul className="nav nav-second-level collapse in">
                                 <li>
                                    
                                </li>
                                <li>
                                    
                                </li>
                                
                            </ul>
                    </li>
                   
                </ul> */}

            </div>

        </div>
        )
    }
}