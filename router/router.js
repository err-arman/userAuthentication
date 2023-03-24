const router = require("express").Router();
const { authenticate } = require("../middleware/jwtAuthenticate");
const routeHandler = require("../handler/handler");

router.patch("/updatename", authenticate, routeHandler.updateUserName);
router.delete("/deleteuser", authenticate, routeHandler.deleteUser);
router.post("/login", routeHandler.signIn);
router.post("/signup", routeHandler.signup);
router.get("/user", authenticate, routeHandler.userDetails);
router.get("/users", routeHandler.allUsers);
router.get("/", routeHandler.rootRoute);
router.get("*", routeHandler.notFound);

module.exports = router;
