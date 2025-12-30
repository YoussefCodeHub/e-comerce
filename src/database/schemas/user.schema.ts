import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, Query } from 'mongoose';
import { hash } from '../../utils/hash.util';
import { encrypt, decrypt } from '../../utils/crypto.util';

// Enums
export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
}

// Interface
export interface IUser {
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  birthDate: Date;
  email: string;
  password: string;
  role: RoleEnum;
  phone?: string;
  address?: string;
  confirmEmail?: Date;
  profilePicture?: string;

  // Audit / Soft Delete
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
  restoredAt?: Date;
  restoredBy?: Types.ObjectId;
}

export type UserDocument = HydratedDocument<IUser>;

// Schema
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User implements IUser {
  @Prop({ required: true, trim: true, lowercase: true })
  firstName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  lastName: string;

  @Prop({ required: true, enum: Object.values(GenderEnum) })
  gender: GenderEnum;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: Object.values(RoleEnum),
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @Prop({ unique: true, sparse: true, trim: true })
  phone?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ type: Date })
  confirmEmail?: Date;

  @Prop({ trim: true })
  profilePicture?: string;

  // Audit / Soft Delete
  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy?: Types.ObjectId;

  @Prop({ type: Date })
  restoredAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  restoredBy?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

//Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ deletedAt: 1 });

//Virtuals
UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

// Hooks
// Pre-save Hook: Hash Password
UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) return;
  if (this.password && this.password.startsWith('$2')) return;
  this.password = await hash(this.password);
});

// Pre-update Hook: Hash Password
UserSchema.pre<Query<any, UserDocument>>('findOneAndUpdate', async function () {
  const update = this.getUpdate() as any;
  if (update?.password && !update.password.startsWith('$2')) {
    update.password = await hash(update.password);
  }
});

// Pre-save Hook: Encrypt Phone
UserSchema.pre<UserDocument>('save', function () {
  if (!this.isModified('phone') || !this.phone) return;
  const isPlainPhone = /^[\d\s+()-]+$/.test(this.phone);
  if (!isPlainPhone) return;
  this.phone = encrypt(this.phone);
});

// Pre-update Hook: Encrypt Phone
UserSchema.pre<Query<any, UserDocument>>('findOneAndUpdate', function () {
  const update = this.getUpdate() as any;
  if (update?.phone) {
    const isPlainPhone = /^[\d\s+()-]+$/.test(update.phone);
    if (isPlainPhone) {
      update.phone = encrypt(update.phone);
    }
  }
});

// Post-find Hook: Decrypt Phone
UserSchema.post<UserDocument[]>('find', function (docs: UserDocument[]) {
  const decryptPhone = (doc: UserDocument) => {
    if (doc?.phone && !/^[\d\s+()-]+$/.test(doc.phone)) {
      try {
        doc.phone = decrypt(doc.phone);
      } catch {}
    }
  };

  if (Array.isArray(docs)) {
    docs.forEach(decryptPhone);
  }
});

UserSchema.post<UserDocument>('findOne', function (doc: UserDocument | null) {
  if (doc) {
    if (doc?.phone && !/^[\d\s+()-]+$/.test(doc.phone)) {
      try {
        doc.phone = decrypt(doc.phone);
      } catch {}
    }
  }
});
