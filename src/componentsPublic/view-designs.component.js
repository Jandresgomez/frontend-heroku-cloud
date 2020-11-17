import LoadingAnimation from "../helpers/loading-animation.component";
import { withRouter } from "react-router";
import { Link } from "react-router-dom"
import React, { Component } from "react";
import '../components.css'
import Axios from "axios";

class PublicViewDesigns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            companyId: this.props.match.params.companyId,
            projectId: this.props.match.params.projectId,
            page: 1,
            designs_data: {},
        }
    }

    componentDidMount() {
        this.fetchDesigns()
    }

    fetchDesigns() {
        this.setState({
            isLoading: true,
        });

        Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${this.state.companyId}/projects/${this.state.projectId}/designs/`,
            {
                params: {
                    'page': this.state.page,
                }
            }
        )
            .then(res => {
                this.setState({
                    designs_data: res.data,
                    isLoading: false,
                });
            })
            .catch(err => {
                this.setState({
                    isLoading: false,
                });
                console.log(err)
            });
    }
    drawDesign(data, index) {
        return (
            <div className="auth-inner-table" key={data.design_uuid}>
                <div className="design-container">
                    <img src={this.getImageURL(process.env.REACT_APP_BACKEND_URL, data.desing_original)} className="design-image" alt="thumbnail" />
                </div>
            </div>
        )
    }

    getImageURL(backendURL, designURL) {
        return designURL
    }

    renderDesigns() {
        if (this.state.designs_data.count > 0) {
            return this.state.designs_data.results.map((el, index) => this.drawDesign(el, index))
        } else {
            return (
                <div className="auth-inner-table">
                    <p>No hay diseños para mostrar.</p>
                </div>
            )
        }
    }

    nextPage() {
        this.setState({
            page: this.state.page + 1
        });
        this.fetchDesigns()
    }

    previousPage() {
        this.setState({
            page: this.state.page - 1
        });
        this.fetchDesigns()
    }

    pageButtons() {
        return (
            <div className="row row-design">
                <div className="column column-design table-padding">
                    <button className="btn btn-primary btn-block" disabled={this.state.designs_data.previous == null} onClick={() => this.previousPage()}>Previous Page</button>
                </div>
                <div className="column column-design table-padding">
                    <button className="btn btn-primary btn-block" disabled={this.state.designs_data.next == null} onClick={() => this.nextPage()}>Next Page</button>
                </div>
            </div>
        );
    }

    drawContent() {
        return (
            <div className="design-container">
                <div className='auth-inner-table'>
                    <div className="row row-design">
                        <div className="column column-design table-padding">
                            <Link to={`/enterprise/${this.state.companyId}/project/${this.state.projectId}/`} className="btn btn-primary btn-block">Volver</Link>
                        </div>

                        <div className="column column-design table-padding">
                            <Link to={`/enterprise/${this.state.companyId}/project/${this.state.projectId}/designs/submit`} className="btn btn-primary btn-block">Subir mi Diseño</Link>
                        </div>
                    </div>
                </div>
                {this.renderDesigns()}
                <div className='auth-inner-table'>
                    {this.pageButtons()}
                </div>
            </div>
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className='auth-inner'>
                    {LoadingAnimation()}
                </div>
            );
        } else {
            return this.drawContent();
        }
    }
}

export default withRouter(PublicViewDesigns);