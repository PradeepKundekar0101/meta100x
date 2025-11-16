import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateAvatar,
} from "../../controller/user";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/avatar", updateAvatar);

export default router;
