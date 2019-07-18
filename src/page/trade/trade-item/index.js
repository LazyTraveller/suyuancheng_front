
import React,{Component} from 'react'
import PageTitle from '../../../component/page'
import Pagination from 'rc-pagination';
import axios from 'axios'
import "antd/dist/antd.css";
import { Modal, Button,Popconfirm, message,Select } from 'antd';
import Alert from '../../../component/alert'
import 'rc-pagination/dist/rc-pagination.min.css'
import util from '../../../util/fun'
import Add from '../../../component/add/add_market.js'
const Option = Select.Option;
export default class TradeItem extends Component{
    constructor(props){
        super(props);
        this.state={
            data_plu:[],//获取到的数据dawdawd
            page_number:0,
            totalElements:1,
            totalPages:1,//数据页面
            find_name:"",
            find_pagination:false,
            find_page_number:0,
            find_totalElements:1,
            visible:false,//编辑显示框控制
            update_name:"",
            update_uuid:"",
            update_remark:"",
            update_address:"",
            update_no:"",
            delete_uuid:"",//删除的数据的key 
            delete_no_find:"",
            params:'',
            add_visible:false,
            selectQuery:"goodsName",
            add_true:false,    
            suyuanchengId:"",
            delete_goodsId:""
            }
    }
    componentDidMount(){
        let suyuanchengId=this.props.match.params.id
        axios.get('/api/rest/trading-item/?page=0&page='+10+"&tradingId="+this.props.match.params.id)
        .then(res=>{
            if(res.status!=200){
                this.props.history.push('/login')
            }
            let data=res.data.content;
            let page_number=res.data.pageable.pageNumber
            let totalElements=res.data.totalElements
            this.setState({
                data_plu:data,
                page_number,
                totalElements,
                pagination:true
            })
        },()=>{
            this.props.history.push('/login')
        })
    }
    // componentDidUpdate(){   
    //     axios.get('/api/rest/market/?page=0&size=10')
    //     .then(res=>{
    //         let data=res.data.content;
    //         let page_number=res.data.pageable.pageNumber;
    //         this.setState({
    //             data_plu:data
    //         })
    //     })
    // }

      //编辑框input框数据更新
      handleUpdate=(e)=>{
        let name=e.target.name;
        let value=e.target.value;
        this.setState({
            [name]:value
        })
      }
    //分页导航
    changeNumber(pageNum){
        this.setState({
            page_number:pageNum,
        },()=>{
            axios.get('/api/rest/plu/?page='+(pageNum-1)+"&trading-item="+this.props.match.params.id)
            .then(res=>{
                let data=res.data.content;
                this.setState({
                    data_plu:data
                })
            })
        })}
        find_changeNumber(pageNum){
            let value=this.state.find_name;
            this.setState({
                find_page_number:pageNum,
            },()=>{
                axios.get('/api/rest/trading-item/?page='+(pageNum-1)+'&'+this.state.selectQuery+'='+value)
                .then(res=>{
                    let data=res.data.content;
                    this.setState({
                        data_plu:data
                    })
                })
            })}
    inputFind(e){
        this.setState({
            find_name:e.target.value
        })
    }
    //搜索功能
    doFind(){
        let value=this.state.find_name;
        axios.get('/api/rest/trading-item/?'+this.state.selectQuery+"="+value+"&tradingId="+this.props.match.params.id)
        .then(res=>{
            let data=res.data.content;
            let page_number=res.data.pageable.pageNumber
            let totalElements=res.data.totalElements
            let totalPages=res.data.totalPages
            this.setState({
                data_plu:data,
                page_number,
                totalElements,
                pagination:true
            })
        })
    }//搜索功能
    inputFinds(e){
        if(e.keyCode=='13'){
            this.doFind()
        }
    }




    //编辑更新数据
    doUpdate(e){
        let value=e.target.parentNode.parentNode;
        let no=value.getAttribute("name");
        let uuid=value.childNodes[0].innerText;
        let goodsId=value.childNodes[1].innerText;
        let code=value.childNodes[2].innerText;
        let price=value.childNodes[3].innerText;
        this.setState({
            visible: true,
            update_goodsId:goodsId,
            update_code:code,
            update_uuid:uuid,
            update_price:price,
            update_no:no,
            find_pagination:false
          });
    }
    //编辑框弹出框点击成功回调
    handleOk = (e) => {
        let suyuanchengdata=this.state.data_plu[this.state.update_no].suYuanCheng.uuid;
        let goodsId=this.state.data_plu[this.state.update_no].id.goodsId;
        let readyData={
            price:this.state.update_price,
            code:this.state.update_code
        }
            
            axios.put('/api/rest/plu/'+suyuanchengdata+'/'+goodsId,readyData)
            .then(res=>{
                
                
                message.success("更新成功")
                let {code,price}=res.data
                this.state.data_plu[this.state.update_no].price=price;
                this.state.data_plu[this.state.update_no].code=code;
                this.setState({
                    visible: false,
                    update_goodsId:goodsId,
                    update_price:price,
                    update_code:code,
                    find_pagination:false
                  });    
            },err=>{
                message.error("输入有误，请重新输入")
            }) 
        }
      //编辑框弹出框失败回调
      handleCancel = (e) => {
        this.setState({
          visible: false,
        });
      }







    //删除按钮
    doDelete(e){
        let value=e.target.parentNode.parentNode;
        let no=value.getAttribute("name");
        let uuid=value.childNodes[0].innerText;
        let goodsId=value.childNodes[1].innerText;
        this.setState({
            delete_uuid:uuid,
            delete_goodsId:goodsId,
            find_pagination:false
        })  
    }
    //删除框确认时候回调
    confirm=(e)=>{
        axios.delete('/api/rest/plu/'+this.state.delete_uuid+'/'+this.state.delete_goodsId)
        .then(res=>{
            if(this.state.find_pagination){
                axios.get('/api/rest/plu/?page='+(this.state.find_page_number-1)+'&'+this.state.selectQuery+'='+this.state.find_name)
                .then(res=>{
                    message.success("删除成功")
                    let data=res.data.content;
                    let find_page_number=res.data.pageable.pageNumber+1
                    let find_totalElements=res.data.totalElements
                    let find_totalPages=res.data.totalPages
                    this.setState({
                        data_plu:data,
                        find_page_number,
                        find_totalElements,
                        find_totalPages
                    })
                })
            }else{
                this.state.data_plu.length--;
                if(this.state.data_plu.length<=0){
                    this.setState({
                        page_number:this.state.page_number-1
                    },()=>{
                        axios.get('/api/rest/plu/?page='+(this.state.page_number-1)+'&size=10')
                        .then(res=>{
                            message.success("删除成功")
                            let data=res.data.content;
                            let page_number=res.data.pageable.pageNumber+1
                            let totalElements=res.data.totalElements
                            let totalPages=res.data.totalPages
                            this.setState({
                                data_plu:data,
                                page_number,
                                totalElements,
                                totalPages
                            })
                        })
                    })
                        
                }else{
                    axios.get('/api/rest/plu/?page='+(this.state.page_number-1)+'&size=10')
                    .then(res=>{
                        message.success("删除成功")
                        let data=res.data.content;
                        let page_number=res.data.pageable.pageNumber+1
                        let totalElements=res.data.totalElements
                        let totalPages=res.data.totalPages
                        this.setState({
                            data_plu:data,
                            page_number,
                            totalElements,
                            totalPages
                        })
                    })
                    }
            }
           
        },err=>{
            new Error(err)
        })
        
        
      }
      //删除框取消时候回调
      cancel=(e)=>{
        message.error('删除失败');
      }



    createMarket(){
        this.setState({
            add_visible:true
        })
    }
    createMarketChangeVisible(){
        this.setState({
            add_visible:false,
            find_pagination:false
        },()=>{
            axios.get('/api/rest/market/?page=0&size=10')
           .then(res=>{
               let data=res.data.content;
               let page_number=res.data.pageable.pageNumber+1
               let totalElements=res.data.totalElements
               let totalPages=res.data.totalPages
               this.setState({
                   data_store:data,
                   page_number,
                   totalElements,
                   totalPages
               })
           })
       })
    }
    addTrue(){
        this.setState({
            addTrue:true
        },()=>{
            axios.get('/api/rest/market/?page=0&size=10')
            .then(res=>{
                let data=res.data.content;
                let page_number=res.data.pageable.pageNumber;
                this.setState({
                    data_plu:data
                })
            })
        })
    }
    handleChange(value) {
        this.setState({
            selectQuery:value
        })
      }
      doTest=()=>{
          let header={
              headers:{
                  'Content-Type':'application/json;charset=utf-8'
              }
          }
          let readyData={
            tradingId:"8300db9a-4435-4fcf-871e-bed7f4036e75",
            goodsId:"52f10761-6091-44cd-8036-95fcdb19bd26",
            weight:35.72,
            price:44.69,
            amount:68.66
          }
        axios.post('/api/rest/trading-item/',readyData,header)
        .then(res=>{
           
            
        })
      }


    render(){
        return (
            <div id="page-wrapper">
                <PageTitle title={`交易项详情`}/>
                <div class="form-group">
                <span>商品名称：</span>
                <input type="text" class="form-control input" placeholder="请输入商品名称" onChange={e=>this.inputFind(e)} onKeyDown={e=> this.inputFinds(e) }/>  
                <Button type="primary"style={{marginLeft:40}} onClick={()=>this.doFind()}>查询</Button>
                {/* <Button type="primary" onClick={()=>this.doTest()}>测试创w建</Button> */}
            </div>
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-striped">   
                            <thead>
                                <tr>
                                    <th>所属溯源秤机号</th>
                                    <th>交易流水号</th>
                                    <th>所属商品名称</th>
                                    <th>重量</th>
                                    <th>单位</th>
                                    <th>单价</th>
                                    <th>金额</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data_plu.map((value,index)=>{
                                        return (
                                            <tr name={index.toString()}>
                                                <td>{value.trading.suYuanCheng.machineId}</td>
                                                <td>{value.trading.sequence}</td>
                                                <td>{value.goods.name}</td>
                                                <td>{value.weight}</td>
                                                <td>{value.unit}</td>
                                                <td>{value.price}</td>
                                                <td>{value.amount}</td>
                                                {/* <td><Button type="primary" className="btn" onClick={(e)=>{this.doUpdate(e)}}>编辑</Button>
                                                    <Popconfirm title="确认删除 ？" onConfirm={this.confirm} onCancel={this.cancel} okText="Yes" cancelText="No">
                                                         <Button type="primary" className="btn" onClick={(e)=>{this.doDelete(e)}}>删除</Button>
                                                    </Popconfirm>
                                                </td> */}
                                            </tr> 
                                        )
                                    })
                                }
                            </tbody>
                        </table> 
                    </div>
                </div>
                {/* {
                    this.state.find_pagination?
                    
                    <Pagination current={this.state.find_page_number} 
                                total={this.state.find_totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.find_changeNumber(pageNum)}}/>:
                   
                } */}
                <Pagination current={this.state.page_number} 
                                total={this.state.totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/>

        <div>
        {this.state.visible?<Modal
          title="编辑PLU"
          okText="确定"
          cancelText="取消"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            <tr>
                <td><span>PLU编码 ：</span><input type="text" class="form-control input update" name="update_code" defaultValue={this.state.update_code} onChange={e=>{this.handleUpdate(e)}}/></td>
              
                <td><span>价格 ： </span><input type="text" class="form-control input update"  name="update_price" defaultValue={this.state.update_price} onChange={e=>{this.handleUpdate(e)}}/></td>
            </tr> 
        </Modal>:null}
        {
            this.state.add_visible?<Add visible={this.state.add_visible} title="添加市场" url="/api/rest/market/" config="address" createMarketChangeVisible={this.createMarketChangeVisible.bind(this)} addTrue={this.addTrue.bind(this)}/>:null
        }
        </div>
            </div>
        )
    }
}