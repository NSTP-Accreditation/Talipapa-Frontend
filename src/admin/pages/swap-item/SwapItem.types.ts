import { ProductInterface, RecordInterface } from "@/types/global.types";

export interface RecordInformationProps {
  recordData: Pick<RecordInterface, '_id' | 'lastName' | 'address' | 'contact_number' | 'points'>
  findProducts: () => void;
}

export interface AvailableProductsProps {
  availableProducts: ProductInterface[];
  quantityInputs: Record<string, number>;
  onQuantityInput: (productId: string, value: string) => void;
  onRedeem: (product: ProductInterface) => void;
  redeemInProgress: boolean;
}


export interface AvailableProductCardProps {
  product: ProductInterface;
  quantity: number;
  onQuantityInput: (productId: string, value: string) => void;
  onRedeem: (product: ProductInterface) => void;
  redeemInProgress: boolean;
}
