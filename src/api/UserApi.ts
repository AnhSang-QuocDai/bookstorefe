import { endpointBE } from "../layouts/utils/Constant";
import UserModel from "../model/UserModel";
import { request, requestAdmin } from "./Request";
import { getRoleByIdUser } from "./RoleApi";

async function getUser(endpoint: string): Promise<UserModel> {
   // Gọi phương thức request()
   const response = await request(endpoint);

   return response;
}

export async function getAllUserRole(): Promise<UserModel[]> {
   const endpoint: string = endpointBE + `/roles`;
   const response = await requestAdmin(endpoint);

   if (!response._embedded || !response._embedded.roles) {
      console.error("Roles not found in response");
      return [];
   }

   const data: UserModel[] = [];

   response._embedded.roles.forEach((roleData: any) => {
      if (roleData._embedded && roleData._embedded.listUsers) {
         const users = roleData._embedded.listUsers.map((userData: any) => {
            const user: UserModel = {
               idUser: userData.idUser,
               avatar: userData.avatar,
               dateOfBirth: userData.dateOfBirth,
               deliveryAddress: userData.deliveryAddress,
               email: userData.email,
               firstName: userData.firstName,
               lastName: userData.lastName,
               gender: userData.gender,
               phoneNumber: userData.phoneNumber,
               username: userData.username,
               role: roleData.nameRole,
            };
            return user;
         });
         data.push(...users); // Nối mảng users vào mảng data
      } else {
         console.error("List users not found in roleData", roleData);
      }
   });

   return data;
}



export async function get1User(idUser: any): Promise<UserModel> {
   const endpoint = endpointBE + `/users/${idUser}`;
   const responseUser = await request(endpoint);
   const responseRole = await getRoleByIdUser(idUser);

   const user: UserModel = {
      idUser: responseUser.idUser,
      avatar: responseUser.avatar,
      dateOfBirth: responseUser.dateOfBirth,
      deliveryAddress: responseUser.deliveryAddress,
      email: responseUser.email,
      firstName: responseUser.firstName,
      lastName: responseUser.lastName,
      gender: responseUser.gender,
      phoneNumber: responseUser.phoneNumber,
      username: responseUser.username,
      role: responseRole.idRole,
   };

   return user;
}

export async function getUserByIdReview(idReview: number): Promise<UserModel> {
   // Xác định endpoint
   const endpoint: string = endpointBE + `/reviews/${idReview}/user`;

   return getUser(endpoint);
}