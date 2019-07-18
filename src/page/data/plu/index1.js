
import React,{Component} from 'react'
import PageTitle from '../../../component/page'
import Pagination from 'rc-pagination';
import axios from 'axios'
import "antd/dist/antd.css";
import { Modal, Button,Popconfirm, message,Select ,Input} from 'antd';
import Alert from '../../../component/alert'
import '../index.css'
import 'rc-pagination/dist/rc-pagination.min.css'
import util from '../../../util/fun'
import Add from '../../../component/add/add_market.js'
const Option = Select.Option;
export default class AddPlu extends Component{
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
            selectQuery:"goodsId",
            add_true:false,    
            suyuanchengId:"",
            delete_goodsId:"",
            data_goods:[],
            goods_totalElements:1,
            goods_totalPages:1,
            i:1
            }
    }
    componentDidMount(){
        let suyuanchengId=this.props.match.params.id
        axios.get('/api/rest/plu/?page=0&size=10')

        .then(res=>{
            if(res.status!=200){
                this.props.history.push('/login')
            }
            let data=res.data.content;
            let page_number=res.data.pageable.pageNumber+1
            let totalElements=res.data.totalElements
            let totalPages=res.data.totalPages
            this.setState({
                data_plu:data,
                page_number,
                totalElements,
                totalPages,
                suyuanchengId
            })
        },()=>{
            this.props.history.push('/login')
        })
        axios.get('/api/rest/goods/?page=0&size=10')
        .then(res=>{
            let data=res.data.content;
            let goods_page_number=res.data.pageable.pageNumber+1
            let goods_totalElements=res.data.totalElements
            let goods_totalPages=res.data.totalPages
            this.setState({
                data_goods:data,
                goods_page_number,
                goods_totalElements,
                goods_totalPages
            })
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
            axios.get('/api/rest/plu/?page='+(pageNum-1))
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
                axios.get('/api/rest/plu/?page='+(pageNum-1)+'&'+this.state.selectQuery+'='+value)
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
        axios.get('/api/rest/plu/?'+this.state.selectQuery+"="+value)
        .then(res=>{
            let data=res.data.content;
            let find_page_number=res.data.pageable.pageNumber+1
            let find_totalElements=res.data.totalElements
            let find_totalPages=res.data.totalPages
            this.setState({
                data_plu:data,
                find_page_number,
                find_totalElements,
                find_pagination:true
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



    render(){
        return (
            <div id="page-wrapper">
                <PageTitle title={`添加PLU编码`}/>
                
                <div className="row">
                    <div className="col-md-12" border="1">
                        <table className="table table-striped">   
                            <thead>
                                <tr>
                                    <th style={{paddingLeft:45}}>PLU编号</th>
                                    <th style={{paddingLeft:45}}>商品</th>
                                    <th style={{paddingLeft:45}}>价格</th>
                                    <th style={{paddingLeft:45}}>PLU编号</th>
                                    <th style={{paddingLeft:45}}>商品</th>
                                    <th style={{paddingLeft:45}}>价格</th>
                                </tr>
                            </thead>
                            <tbody>
                                <td style={{paddingLeft:45}}>{this.state.i}</td>
                                <Select style={{width:200}}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </Select>
                                <td style={{paddingLeft:15}}><Input type="text" defaultValue={this.state.update_name} name="update_name" onChange={e=>{this.handleUpdate(e)}}/></td>
                                <td style={{paddingLeft:45}}>{this.state.i+1}</td>
                                <Select style={{paddingLeft:45}} style={{width:200}}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </Select>
                                <td style={{paddingLeft:45}}>23.5</td>
                            </tbody>
                        </table> 
                    </div>
                </div>
                {
                    this.state.find_pagination?
                    
                    <Pagination current={this.state.find_page_number} 
                                total={this.state.find_totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.find_changeNumber(pageNum)}}/>:
                    <Pagination current={this.state.page_number} 
                                total={this.state.totalElements}
                                showQuickJumper
                                hideOnSinglePage
                                pageSize={10}
                                onChange={pageNum=>{this.changeNumber(pageNum)}}/>
                }

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