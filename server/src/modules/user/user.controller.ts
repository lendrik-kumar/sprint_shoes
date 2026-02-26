import { Request, Response } from 'express';
import { userService } from './user.service';
import { success, ok } from '@utils/response';

export class UserController {
  public getProfile = async (req: Request, res: Response) => {
    const profile = await userService.getProfile(req.userId!);
    res.json(success(profile));
  };

  public updateProfile = async (req: Request, res: Response) => {
    const updated = await userService.updateProfile(req.userId!, req.body);
    res.json(success(updated, 'Profile updated successfully'));
  };

  public deleteAccount = async (req: Request, res: Response) => {
    await userService.deleteAccount(req.userId!);
    res.json(ok('Account deactivated successfully'));
  };

  public getAddresses = async (req: Request, res: Response) => {
    const addresses = await userService.getAddresses(req.userId!);
    res.json(success(addresses));
  };

  public addAddress = async (req: Request, res: Response) => {
    const address = await userService.addAddress(req.userId!, req.body);
    res.json(success(address, 'Address added successfully'));
  };

  public updateAddress = async (req: Request, res: Response) => {
    const address = await userService.updateAddress(req.userId!, req.params.id, req.body);
    res.json(success(address, 'Address updated successfully'));
  };

  public deleteAddress = async (req: Request, res: Response) => {
    await userService.deleteAddress(req.userId!, req.params.id);
    res.json(ok('Address deleted successfully'));
  };
}

export const userController = new UserController();
