import type { CollectionConfig } from "payload";

const isAuthenticated: NonNullable<CollectionConfig["access"]>["read"] = ({
  req,
}) => Boolean(req.user);

export const PayloadUsers: CollectionConfig = {
  slug: "cms-users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
  },
  fields: [],
};
