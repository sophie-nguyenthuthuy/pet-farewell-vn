import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description:
    'Pet Farewell — đội ngũ chuyên môn về tiễn biệt thú cưng tại Việt Nam, đặt sự trân trọng và tính riêng tư lên hàng đầu.',
};

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="font-serif text-4xl">Về Pet Farewell</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Chúng tôi tin rằng những người bạn nhỏ xứng đáng được tiễn biệt một cách trân trọng, không
        phải tự DIY trên những nhóm Facebook hay đốt sau vườn.
      </p>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <h2 className="font-serif">Câu chuyện của chúng tôi</h2>
        <p>
          Pet Farewell ra đời từ chính trải nghiệm cá nhân của những người sáng lập — khi một
          thành viên trong gia đình bốn chân ra đi và họ phát hiện không có dịch vụ nào tại Việt
          Nam đảm bảo được sự riêng tư, minh bạch và tâm linh.
        </p>

        <h2 className="font-serif">Giá trị cốt lõi</h2>
        <ul>
          <li><strong>Minh bạch.</strong> Hỏa táng riêng nghĩa là một bé, một buồng — có camera quan sát.</li>
          <li><strong>Trân trọng.</strong> Mỗi nghi thức tiễn biệt được thiết kế riêng theo gia đình.</li>
          <li><strong>Đồng hành.</strong> Chuyên gia tâm lý hỗ trợ trong suốt và sau quá trình tiễn biệt.</li>
        </ul>

        <h2 className="font-serif">Giấy phép & tiêu chuẩn</h2>
        <p>
          Chúng tôi tuân thủ quy định môi trường về lò đốt theo QCVN 30:2012/BTNMT, đăng ký kinh
          doanh đầy đủ và bảo hiểm trách nhiệm dịch vụ.
        </p>
      </div>
    </div>
  );
}
