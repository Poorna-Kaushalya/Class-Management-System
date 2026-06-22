const { z } = require("zod");

const createTeacherSchema = z.object({
  name: z.string().min(2),
  teacherId: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),

  phone: z.string().optional(),

  address: z
    .object({
      no: z.string().optional(),
      street: z.string().optional(),
      lane: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),

  subjects: z.array(z.string()).optional(),

  grades: z.array(z.string()).optional(),

  roles: z.array(z.enum(["ADMIN", "TEACHER"])).optional(),
});

module.exports = { createTeacherSchema };