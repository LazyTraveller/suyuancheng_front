import React from 'react'
import './index.css'
import NavTop from '../../component/nav-top'
import NavSide from '../../component/nav-side'
class Layout extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div id="wrapper">
                <NavTop/>
                <NavSide/>
                {this.props.children}
            </div>
        )
    }
}
export default Layout