import { Link } from "react-router-dom"
import { withRouter, Redirect } from "react-router";
import React, { Component } from "react";
import '../components.css';
import axios from "axios";

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {
                name: "",
                description: "",
                cost: "",
            },
            projectId: this.props.match.params.projectId,
            isLoading: true,
        }
    }

    componentDidMount() {
        this.fetchProjectData()
    }

    fetchProjectData() {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/enterprise/${this.props.companyId}/projects/${this.state.projectId}`,
            {
                headers: {
                    'Authorization': `Token ${this.props.userToken}`,
                }
            }
        )
            .then(res => {
                this.setState({
                    project: res.data
                })
            })
            .catch(err => {
                this.setState({
                    isLoading: false
                })
                console.log(err)
            })
    }

    deleteProject(id) {
        var willDelete = window.confirm('Are you sure you want to delete the current project? This action is final and cannot be reversed.')
        if (!willDelete) return

        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/enterprise/${this.props.companyId}/projects/${id}`,
            {
                headers: {
                    'Authorization': `Token ${this.props.userToken}`,
                }
            }
        )
        .then(res => {
            this.setState({
                project: null
            })
            console.log(res)
        })
        .catch(err => {
            console.log(err);
        })
    }

    drawForm() {
        return (
            <div>
                <h1 className="project-title">{`Proyecto "${this.state.project.name}"`}</h1>

                <div className="column">
                    <div className="row">
                        <label> Descripción del proyecto: </label>
                    </div>
                    <div className="row">
                        <p>{this.state.project.description}</p>
                    </div>

                    <div className="row">
                        <label> Costo del proyecto: </label>
                    </div>
                    <div className="row">
                        <p>{`$${this.state.project.cost}`}</p>
                    </div>
                </div>

                <div className="column">
                    <div>
                        <div className="row table-padding column-padding">
                            <Link className="btn btn-primary btn-block" to={`/project/${this.state.projectId}/designs/1`}>Ver diseños</Link>
                        </div>
                        <div className="row table-padding column-padding">
                            <Link className="btn btn-primary btn-block" to={`/project/${this.state.projectId}/edit`}>Editar proyecto</Link>
                        </div>
                        <div className="row table-padding column-padding">
                            <button className="btn btn-danger btn-block" onClick={() => this.deleteProject(this.state.projectId)}>Eliminar proyecto</button>
                        </div>
                        <div className="row table-padding column-padding">
                            <Link className="btn btn-danger btn-block" to="/projects/">Volver</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (this.state.project) {
            return (
                <div className="auth-inner-project">
                    {this.drawForm()}
                </div>
            );
        } else {
            return (
                <Redirect to="/projects"/>
            )
        }
    }

}

export default withRouter(Project)