import React from 'react'
import  echarts from 'echarts';
// 引入折线图。
import 'echarts/lib/chart/pie'
import  'echarts/lib/chart/bar';
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import './index.css'
import "antd/dist/antd.css";
import { Modal, Button,Popconfirm, message,Select ,Card,Col,Row,Input,Spin,DatePicker,Alert,notification } from 'antd';
import 'rc-pagination/dist/rc-pagination.min.css'
import PageTitle from '../../component/page'
import axios from 'axios';
import moment from'moment'
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const openNotificationWithIcon = (type) => {
    notification[type]({
      message: '暂无数据',
      duration:2
    });
  };
class Home extends React.Component{
    constructor(props){
        super(props)
        this.state={
            nameList:[],
            seriesData:{},
            selected:{},
            date:[],
            alert:false
        }
    }
    componentDidMount(){
        axios.get("/api/rest/e-charts/")
        .then(res=>{
            if(res.status!=200){
                this.props.history.push('/login')
            }
            let nameList=Object.keys(res.data)
            let seriesData=[]
            let selected = {};
            for(let i=0;i<nameList.length;i++){
                seriesData.push({
                    name:nameList[i],
                    value:res.data[nameList[i]]
                })
                selected[nameList[i]]=i <nameList.length
            }
            let alert=false;
            if(nameList.length<=0){
                alert=true
            }
           this.setState({
            nameList,
            seriesData,
            selected,
            alert
           })
        },()=>{
            this.props.history.push('/login')
        })
    }
    componentDidUpdate(){
        var myChart = echarts.init(document.getElementById('main'),"macarons");
        myChart.setOption({
            title : {
                text: '销售数据统计',
                subtext: '溯源秤',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: this.state.nameList,
                selected: this.state.selected
            },
            series : [
                {
                    name: '名称',
                    type: 'pie',
                    radius : '55%',
                    center: ['40%', '50%'],
                    data:this.state.seriesData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        })
    }


    changDate=(e,value)=>{
        let beforeTime=value[0],
            afterTime=value[1];
        let before=moment(beforeTime).format('YYYY-MM-DDTHH:mm:ss');
        let after=moment(afterTime).format('YYYY-MM-DDTHH:mm:ss');
        axios.get("/api/rest/e-charts/?before="+before+"&after="+after)
        .then(res=>{
            let nameList=Object.keys(res.data)
            let seriesData=[]
            let selected = {};
            for(let i=0;i<nameList.length;i++){
                seriesData.push({
                    name:nameList[i],
                    value:res.data[nameList[i]]
                })
                selected[nameList[i]]=i <nameList.length
            }
        this.setState({
            nameList,
            seriesData,
            selected,
            before,
            after
        })
        })
      }
    onChange=(date, dateString)=>{
        let beforeDate=dateString[0],
            afterDate=dateString[1];
        this.setState({
            date:dateString
        },()=>{
            let before=moment(beforeDate,)
           
        })
      }
    render(){
        
        return (
            <div id="page-wrapper">
            {this.state.alert ? openNotificationWithIcon('warning') : null}
            <RangePicker onChange={(e,value)=>{this.changDate(e,value)}} locale={"locale"} style={{marginTop:-15,marginLeft:-25}}placeholder={["开始日期",'结束日期']}/>
                <div id="echarts">
                    <div id="main" style={{ width: 900, height: 600}}></div>
                    
                </div>
                
            </div>
        )
    }
}

export default Home 