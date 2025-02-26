import { Router, Request, Response, NextFunction } from "express";
import { BookController } from "../controller";

const router = Router();
const bookController = new BookController();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.post("/", asyncHandler(bookController.create));
router.get("/", asyncHandler(bookController.getAll));
router.get("/:id", asyncHandler(bookController.getOne));
router.put("/:id", asyncHandler(bookController.update));
router.delete("/:id", asyncHandler(bookController.delete));

export default router;
