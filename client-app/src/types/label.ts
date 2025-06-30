// Bir etiketin temel yapısı
export interface LabelDto {
  id: number;
  title: string;
  color: string;
}

// Yeni bir etiket oluştururken API'ye gönderilecek veri
export interface CreateLabelDto {
  title: string;
  color: string;
}
