import React, { useEffect } from "react";
import classes from "./signup.module.scss";
import { Formik, Form} from "formik";
import * as yup from "yup";
import FormikControl from "../../components/formElements/formikControl";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner/spinner";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

const initialValues = {
  email: "",
  username:"",
  password: "",
  contactNo: ""
};

const validationSchema = yup.object({
  contactNo: yup.string().required("This field is required"),
  username:yup.string().required("This field is required"),
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter a valid email"),
  password: yup
    .string()
    .required("This field is required")
    .min(6, "Password should be 6 characters long")
});

const SignUp = (props) => {
  useEffect(() => {
    props.clear();
  }, []);

  let btnContent = "Submit";
  if (props.loading) {
    btnContent = <Spinner />;
  }

  let error = props.error ? (
    <div className={classes.form__error}>{props.error}</div>
  ) : null;

  return (

    <div className="_form">
      <div className="form__inner__top">
          <div className={classes.form}>
          {error}

          <h2 style={{marginTop:"10rem"}} className={classes.form__header}>Sign Up</h2>

          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              props.auth(
                values.email,
                values.password,
                values.username,
                values.contactNo,
                props
              );
            }}
            validationSchema={validationSchema}
            validateOnMount
          >
            {(formik) => {
              return (
                <Form
                autoComplete = "off"
                noValidate
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "45rem",
                  }}
                >

                  <FormikControl
                    control="input"
                    type="text"
                    label="Username"
                    name="username"
                    touched={formik.touched.username}
                  />
                  <FormikControl
                    control="input"
                    type="email"
                    label="Email"
                    name="email"
                    touched={formik.touched.email}
                  />

                <FormikControl
                    control="input"
                    type="text"
                    label="ContactNo"
                    name="contactNo"
                    touched={formik.touched.contactNo}
                  />

                  <FormikControl
                    control="input"
                    type="password"
                    label="Password"
                    name="password"
                    touched={formik.touched.password}
                  />

                  <button
                    type="submit"
                    disabled={!formik.isValid}
                    className={classes.btn__submit}
                  >
                    {btnContent}
                  </button>
                  <Link className={classes.link} to="/">
                    Already have an account ? <span style={{color:"#000"}}> Click here</span> 
                  </Link>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
    
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, username, contactNo, props) =>
      dispatch(actions.auth(email, password, username, contactNo, props)),
    clear: () => dispatch(actions.clear()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
