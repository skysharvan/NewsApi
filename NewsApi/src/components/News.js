import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export default class News extends Component {
    static defaultProps = {
        country:'in',
        pageSize:8,
        category:'general'
      }
      static propTypes = {
       country:PropTypes.string.isRequired,
       pageSize:PropTypes.number,
       category:PropTypes.string

      }
      async updatenews(){
        this.props.setProgress(10);
        console.log(process.env.REACT_APP_NEWS_API);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
        console.log(url);
        let data = await fetch(url);
        this.props.setProgress(40)
        let parsedData = await data.json()
        this.props.setProgress(70)
        this.setState({
            articles:parsedData.articles,
            totalResults:parsedData.totalResults,
            loading:false
        })
        this.props.setProgress(100)
      }
       captalizeFirstLetter = (string)=>{
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    constructor(props){
        super(props);
        this.state = {
            articles :[],
            loading:false,
            page:1
        }
        document.title = `${this.captalizeFirstLetter(this.props.category)} - NewsMonkey`;
    }
    async componentDidMount(){
        this.updatenews();

    }
    handlePrevClick = async()=>{
        this.setState({page: this.state.page-1})
        this.updatenews();

   }
    handleNextClick = async()=>{
        this.setState({page:this.state.page+1});
        this.updatenews();
    }
    fetchMoreData = async()=>{
        this.setState({page:this.state.page+1});
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true})
        let data = await fetch(url);
        let parsedData = await data.json()
        this.setState({
            articles:this.state.articles.concat( parsedData.articles),
            totalResults:parsedData.totalResults,
            loading:false
        })
    }

  render() {  
    return (
      <div className='container  mx-3'>
        <h1 className="text-center" style={{margin:'35px 0px'}}>NewsMonkey - Top {this.captalizeFirstLetter(this.props.category)} Headlines</h1>
    
        <InfiniteScroll
                dataLength={this.state.articles&&this.state.articles.length}
                next={this.fetchMoreData}
                hasMore={this.state.articles && this.state.articles.length !== this.state.totalResults}
                loader={<Spinner/>}
                >
                <div className="row" >
                    { this.state.articles.map((element,index)=>{
                    return  <div key={index} className="col-md-3 my-3">
                        <NewsItem  title={element.title ?element.title.slice(0,45):""} description={element.description?element.description.slice(0,95):""} NewsUrl={element.url} ImageUrl={element.urlToImage} author={element.author?element.author:"Unknown"} date={element.publishedAt} source={element.source.name}/>
                        </div>
                    })}
                </div>
        </InfiniteScroll>
      </div>
    )
  }
}
