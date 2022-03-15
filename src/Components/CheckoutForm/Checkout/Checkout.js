import React, { useEffect, useState } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CssBaseline,
} from "@material-ui/core";
import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";
import { Link, useNavigate } from "react-router-dom";

const steps = ["Shipping Address", "Payment Details"];

function Checkout({ cart, order, onCaptureCheckout, error }) {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const navigate = useNavigate();
  const [isFinished, setIsFinished] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    const id = commerce.cart.id();
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(id, {
          type: "cart",
        });
        setCheckoutToken(token);
      } catch (error) {
        navigate.pushState("/");
      }
    };
    generateToken();
  }, [cart]);

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  // const next = (data) => {
  //   setShippingData(data);
  //   nextStep();
  // };

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={nextStep} />
    ) : (
      <PaymentForm
        onCaptureCheckout={onCaptureCheckout}
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        nextStep={nextStep}
        timeout={timeout}
      />
    );

  let timeout = () => {
    setTimeout(() => {
      setIsFinished(true);
    }, 3000);
  };

  let Confirmation = () =>
    order.customer ? (
      <>
        <div>
          <Typography variant="h5">
            Thank you for your purchase, {order.customer.firstname}
            {order.customer.lastname}
          </Typography>
          <Divider classname={classes.divider} />
          <Typography variant="subtitle2">
            Order ref: {order.customer_reference}{" "}
          </Typography>
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">
          Back to home
        </Button>
      </>
    ) : isFinished ? (
      <>
        <div>
          <Typography variant="h5">Thank you for your purchase!</Typography>
          <Divider classname={classes.divider} />
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">
          Back to home
        </Button>
      </>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );

  if (error) {
    <>
      <Typography variant="h5"> Error: {Error} </Typography>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button">
        Back to home
      </Button>
    </>;
  }
  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
}

export default Checkout;
