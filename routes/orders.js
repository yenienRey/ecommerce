const router = require("express").Router();
const { Order, User } = require("../models/index");

router.get("/", (req, res) => Order.findAll().then((order) => res.send(order)));

router.post("/new", (req, res) => {
  console.log(req.body);
  Order.create({
    userId: req.body.userId,
    orderStatus: "pending",
    userEmail: req.body.userEmail,
  })
    .then((order) => res.send(order))
    .catch((err) => console.log(err));
});

router.put("/update", (req, res) => {
  if (req.body.address) {
    Order.findByPk(req.body.orderId)
      .then((order) => {
        order.address = req.body.address;
        order.save();
        res.send(order);
      })
      .catch((err) => console.log(err));
  } else if (req.body.subtotal) {
    Order.findByPk(req.body.orderId)
      .then((order) => {
        order.ammount = req.body.subtotal;
        order.save();
        res.send(order);
      })
      .catch((err) => console.log(err));
  } else if (req.body.fullName) {
    Order.findByPk(req.body.orderId)
      .then((order) => {
        order.recipient = req.body.fullName;
        order.save();
        res.send(order);
      })
      .catch((err) => console.log(err));
  } else if (req.body.status) {
    console.log(
      "entrando al update con status",
      req.body.status,
      "y order",
      req.body.orderId
    );
    Order.findByPk(req.body.orderId)
      .then((order) => {
        order.orderStatus = req.body.status;
        order.save();
        res.send(order);
      })
      .catch((err) => console.log(err));
  }
});

//+Get order (for current user)
router.get("/:userId", (req, res) => {
  Order.findOne({
    where: { userId: req.params.userId, orderStatus: "pending" },
  })
    .then((order) => res.status(200).send(order))
    .catch((err) => console.log(err));
});

//+Get single order (for any user)
router.get("/getsingleorder/:id", (req, res) => {
  Order.findByPk(req.params.id)
    .then((order) => res.status(200).send(order))
    .catch((err) => console.log(err));
});

//+Get all orders for current user
router.get("/list/:userId", (req, res) => {
  Order.findAll({
    where: { userId: req.params.userId },
    order: [["updatedAt", "DESC"]],
  })
    .then((orders) => res.status(200).send(orders))
    .catch((err) => console.log(err));
});

//+Ruta solo para el seed
router.post("/newCompletedOrder", (req, res) => {
  Order.create({
    userId: req.body.userId,
    orderStatus: req.body.orderStatus,
    ammount: req.body.ammount,
    address: req.body.address,
  })
    .then((order) => res.send(order))
    .catch((err) => console.log(err));
});

module.exports = router;

///transfer/database cleanup-----------------
/*
SELECT * INTO "rejectedOrders"
FROM orders
WHERE "orderStatus" = "cancelled"
------then=>
DELETE FROM orders
WHERE "orderStatus" = "cancelled"
*/
//Se deberia mover también los elemntos de order_product, moviendola a cancelled_order_product por ej y cambiar el nombre de las claves foraneas.
/*
ALTER TABLE `cancelled_order_product`
DROP FOREIGN KEY `orderId`;

ALTER TABLE `cancelled_order_product`
ADD CONSTRAINT `cancelled_orderId`
    FOREIGN KEY (`cancelled_order_productId`) REFERENCES `cancelled_order` (`id`) ON DELETE CASCADE;
repetir para productId
*/

//MASS UPDATE DE ITEMS (No es buena practica, mejor actualizar uno a uno a medida que suceden los cambios)
// update item quantity
// router.get("/test/:quantity/:orderId/:productId", (req, res) =>{
//   const {quantity, orderId, productId} = req.params
//   database.query(`insert into order_product ("quantity","createdAt","updatedAt","productId","orderId") values (?,NOW(),NOW(),?,?)`,{
//     replacements:[quantity,orderId,productId]
//   })
// })

//update several items
// router.get('/test/', (req, res)=>{
//   database.query(
//     `
//         UPDATE order_product
//         SET 'orderId' = new.'orderId', 'productId' = new.'productId', 'quantity' = new.'quantity'
//         from (values ?) AS new('orderId', 'productId', 'quantity')
//         WHERE employee.id = new.employeeId
//     `,
//     {
//         replacements: [[1, 13, 1],[1, 4, 1],[2, 1, 2],[1, 13, 1]],
//         type: models.models.sequelize.QueryTypes.INSERT // type: Sequelize.QueryTypes.INSERT o sera database.queryTypes.Insert
//     }
//   )
// }

// router.post("/new", (req, res) => {
//   database.query(
//       `INSERT INTO orders ("userId", "ammount", "address", "orderStatus", "createdAt","updatedAt")
//   VALUES (${req.body.userId}, 0, '', 'pending', NOW(), NOW())`
//     )
//     .then(() => {
//       res.sendStatus(201);
//     })
//     .catch((err) => console.log(err));
// });
