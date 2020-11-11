import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

// Private components
import Login from "./componentsPrivate/login.component";
import SignUp from "./componentsPrivate/signup.component";
import ProjectsList from "./componentsPrivate/projects.component";
import AddProject from "./componentsPrivate/add-project.component";
import EditProject from "./componentsPrivate/edit-project.component";
import Project from "./componentsPrivate/project.component";
import About from "./componentsPrivate/about-us.component";
import UserHome from "./componentsPrivate/user-home.component";
import ViewDesigns from "./componentsPrivate/view-designs.component";

// Public components
import PublicProjectsList from "./componentsPublic/projects-public.component";
import PublicViewDesigns from "./componentsPublic/view-designs.component";
import AddDesign from "./componentsPublic/add-design.component";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: "",
      companyName: "",
      companyId: "",
    }
  }

  renderButtons() {
    if (this.state.userToken === "") {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to={"/"}>About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/sign-in"}>Login</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/api-auth"}>Sign up</Link>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to={"/user-home"}>URL Empresarial</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/projects"}>Mis proyectos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/create-project"}>Añadir Projecto</Link>
          </li>
        </ul>
      );
    }
  }

  submitUserData(name, id) {
    this.setState({
      companyName: name,
      companyId: id
    })
  }

  submitToken(token) {
    this.setState({
      userToken: token
    })
  }

  isAuthWrapper(el) {
    if (this.state.userToken !== "") {
      return el
    } else {
      return (<Redirect to='/' />)
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <nav className="navbar navbar-expand-lg navbar-dark navbar-fixed-top">
            <div className="container">
              <div className="collapse navbar-collapse">
                <div className="navbar-header">
                  <Link className="navbar-brand" to={"/"}>DesignMatch</Link>
                </div>
                {this.renderButtons()}
              </div>
            </div>
          </nav>

          <div className="content-section">
            <div className="auth-wrapper">
              <Switch>
                {/* Main site endpoints */}
                <Route exact path='/' component={About} />
                <Route path="/sign-in">
                  <Login submitToken={(token) => this.submitToken(token)} submitUserData={(name, id) => this.submitUserData(name, id)} />
                </Route>
                <Route path="/api-auth">
                  <SignUp submitToken={(token) => this.submitToken(token)} submitUserData={(name, id) => this.submitUserData(name, id)} />
                </Route>
                
                {/* Authenticated endpoints */}
                <Route path="/project/:projectId/designs/:page">
                  {this.isAuthWrapper(<ViewDesigns userToken={this.state.userToken} companyName={this.state.companyName} companyId={this.state.companyId} />)}
                </Route>
                <Route path="/project/:projectId/edit">
                  {this.isAuthWrapper(<EditProject userToken={this.state.userToken} companyName={this.state.companyName} companyId={this.state.companyId} />)}
                </Route>
                <Route path="/project/:projectId">
                  {this.isAuthWrapper(<Project userToken={this.state.userToken} companyName={this.state.companyName} companyId={this.state.companyId} />)}
                </Route>
                <Route path="/projects">
                  {this.isAuthWrapper(<ProjectsList userToken={this.state.userToken} companyName={this.state.companyName} companyId={this.state.companyId} />)}
                </Route>
                <Route path="/create-project">
                  {this.isAuthWrapper(<AddProject userToken={this.state.userToken} companyName={this.state.companyName} companyId={this.state.companyId} />)}
                </Route>
                <Route path="/user-home">
                  {this.isAuthWrapper(<UserHome userToken={this.state.userToken} companyName={this.state.companyName} companyId={this.state.companyId} />)}
                </Route>
                
                {/* Public endpoints */}
                <Route path="/enterprise/:companyId/project/:projectId/designs/submit">
                  <AddDesign />
                </Route>
                <Route path="/enterprise/:companyId/project/:projectId/designs/">
                  <PublicViewDesigns />
                </Route>
                <Route path="/enterprise/:companyId">
                  <PublicProjectsList />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
