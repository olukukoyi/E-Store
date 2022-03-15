import React from "react";
import {
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@material-ui/core";
import useStyles from "./styles";

function CartItem({ item, onHandleRemoveFromCart, onHandleUpdateCartQty }) {
  const classes = useStyles();
  return (
    <Card>
      <CardMedia
        className={classes.media}
        image={item.image.url}
        alt={item.name}
      />
      <CardContent className={classes.cartContent}>
        <Typography variant="h4">{item.name}</Typography>
        <Typography variant="h5">
          {item.line_total.formatted_with_symbol}
        </Typography>
      </CardContent>
      <CardActions classes={classes.CardActions}>
        <div className={classes.buttons}>
          <Button
            onClick={() => {
              onHandleUpdateCartQty(item.id, item.quantity - 1);
            }}
            type="button"
            size="small"
          >
            -
          </Button>
          <Typography> {item.quantity} </Typography>
          <Button
            onClick={() => {
              onHandleUpdateCartQty(item.id, item.quantity + 1);
            }}
            type="button"
            size="small"
          >
            +
          </Button>
        </div>
        <Button
          onClick={() => {
            onHandleRemoveFromCart(item.id);
          }}
          variant="contained"
          type="button"
          color="secondary"
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
}

export default CartItem;
