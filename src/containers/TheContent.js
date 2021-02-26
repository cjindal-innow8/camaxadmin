import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'
import routes from '../routes'
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const PrivateRoutes = ({ component: Component,  ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        rest.isAuthenticated
        ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login" }}
          />
        )
      }
    />
  );
};


const TheContent = () => {

  const isLogin = localStorage.getItem('isLogin') 
  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <PrivateRoutes
            exact
            path={route.path}
            component={route.component}
            isAuthenticated={isLogin}
          />
              )
            })}
            <Redirect from="/" to="/login" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
