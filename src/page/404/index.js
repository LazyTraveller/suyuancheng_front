import React,{Component}from 'react'
import axios from 'axios'
import {Link,NavLink} from 'react-router-dom'
import {Button} from 'antd'
export default class NotFound extends Component{
    constructor(props){
        super(props)
    }
    
    render(){
        return (
            <div id="page-wrapper" style={{paddingLeft:215,paddingTop:120,}}>
                <img src="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg" style={{float:"left"}} alt="404未找到"/>
                <div style={{color: "#434e59",
                                fontSize:72,
                                marginTop:100,
                                marginLeft:140,
                                float:"left",
                                fontWeight: 600
                            }}>404
                            <p style={{color: "rgba(0,0,0,.45)",
                                        fontSize: 20,
                                        fontWeight:400
                                        }}>抱歉，你访问的页面不存在
                                
                            </p>
                            <p style={{marginTop:-15}}>
                            <Link to='/info'>
                                <Button type="primary">返回首页</Button>
                            </Link>
                            </p>
                            
                </div>
                
            </div>
        )
    }
}