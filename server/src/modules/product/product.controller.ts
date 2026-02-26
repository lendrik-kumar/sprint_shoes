import { Request, Response } from 'express';
import { productService } from './product.service';
import { success } from '@utils/response';

export class ProductController {
  public list = async (req: Request, res: Response) => {
    const result = await productService.list(req.query);
    res.json(success(result));
  };

  public getById = async (req: Request, res: Response) => {
    const product = await productService.getById(req.params.id);
    res.json(success(product));
  };

  public search = async (req: Request, res: Response) => {
    const { query, limit } = req.query as any;
    const result = await productService.search(query, limit);
    res.json(success(result));
  };

  public getByCategory = async (req: Request, res: Response) => {
    const result = await productService.getByCategory(req.params.id, req.query);
    res.json(success(result));
  };

  public getFiltersMeta = async (req: Request, res: Response) => {
    const meta = await productService.getFiltersMeta();
    res.json(success(meta));
  };
}

export const productController = new ProductController();
