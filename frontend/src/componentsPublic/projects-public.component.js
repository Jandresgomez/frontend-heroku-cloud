import { Link } from "react-router-dom"
import axios from 'axios';
import React, { Component } from "react";
import LoadingComponent from "../helpers/loading-animation.component"
import { withRouter } from "react-router";

class PublicProjectsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            companyId: this.props.match.params.companyId,
            isLoading: false,
        }
    }

    componentDidMount() {
        this.fetchProjectsData()
    }

    fetchProjectsData = () => {
        var self = this;
        self.setState({
            isLoading: true
        })

        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${this.state.companyId}/projects/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }
        )
            .then(res => {
                self.setState({
                    projects: res.data,
                    isLoading: false,
                });
            }).catch(error => {
                self.setState({
                    isLoading: false,
                });
                console.log(error);
            })
    }

    drawIndividualProject(project) {
        return (
            <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td><Link className="btn btn-primary btn-block" to={`/enterprise/${this.state.companyId}/project/${project.id}/designs`}>Ver Diseños</Link></td>
            </tr>
        );
    }

    drawForm() {
        return (
            <div className="auth-inner-table">
                <h1 className="project-title">{`Proyectos de la compañia`}</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Diseños</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.projects.map((el) => this.drawIndividualProject(el))}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="auth-inner">
                    {LoadingComponent()}
                </div>
            );
        } else {
            return (
                <div className="auth-inner">
                    {this.drawForm()}
                </div>
            );
        }
    }
}

export default withRouter(PublicProjectsList)