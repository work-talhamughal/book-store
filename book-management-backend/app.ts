import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import cors from "cors";
import { configureSecurityMiddleware } from "./src/middleware";
import { errorHandler, AppError } from "./src/middleware";
import { initializeDatabase } from "./src/config";
import bookRoutes from "./src/routes/bookRoutes";

const app = express();
const port = process.env.PORT || 3001;

initializeDatabase()
  .then(() => {
    configureSecurityMiddleware(app);

    app.use(cors());
    app.use(express.json());

    app.use("/api/books", bookRoutes);

    app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
      errorHandler(err, req, res, next);
    }) as ErrorRequestHandler);

    if (process.env.NODE_ENV !== "test") {
      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    }
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

export default app;
