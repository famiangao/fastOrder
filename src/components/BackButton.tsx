import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface BackButtonProps {
  to?: string; // 可选的返回路径，默认为首页
  style?: React.CSSProperties; // 添加样式属性
}

const BackButton: React.FC<BackButtonProps> = ({ to = '/', style }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <Button 
      icon={<ArrowLeftOutlined />} 
      onClick={handleBack}
      style={{ marginBottom: 16, ...style }}
    >
      返回
    </Button>
  );
};

export default BackButton; 