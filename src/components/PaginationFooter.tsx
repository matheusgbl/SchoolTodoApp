import React from 'react';
import styled from 'styled-components/native';
import { PaginationInfo } from '../store/slices/observationSlice';

const FooterContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-top-width: 1px;
  border-top-color: #E1E5E9;
  padding: ${({ theme }) => theme.spacing.medium}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const PageButton = styled.TouchableOpacity<{ disabled?: boolean; variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.small}px ${({ theme }) => theme.spacing.medium}px;
  border-radius: 6px;
  margin: 0 ${({ theme }) => theme.spacing.small / 2}px;
  background-color: ${({ disabled, variant, theme }) => {
    if (disabled) return '#F5F5F5';
    if (variant === 'primary') return theme.colors.primary;
    return 'transparent';
  }};
  border: 1px solid ${({ disabled, variant, theme }) => {
    if (disabled) return '#E1E5E9';
    if (variant === 'primary') return theme.colors.primary;
    return '#E1E5E9';
  }};
  min-width: 40px;
  align-items: center;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

const PageButtonText = styled.Text<{ disabled?: boolean; variant?: 'primary' | 'secondary' }>`
  color: ${({ disabled, variant, theme }) => {
    if (disabled) return '#999';
    if (variant === 'primary') return theme.colors.white;
    return theme.colors.text;
  }};
  font-weight: ${({ variant }) => variant === 'primary' ? '600' : '500'};
  font-size: 14px;
`;

const PageInfo = styled.View`
  margin: 0 ${({ theme }) => theme.spacing.medium}px;
  align-items: center;
`;

const PageInfoText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  text-align: center;
`;

const PageInfoNumbers = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  margin-top: 2px;
`;

const ItemsInfo = styled.View`
  position: absolute;
  left: ${({ theme }) => theme.spacing.medium}px;
`;

const ItemsInfoText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;

interface Props {
  pagination: PaginationInfo;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  loading?: boolean;
}

const PaginationFooter: React.FC<Props> = ({
  pagination,
  onPreviousPage,
  onNextPage,
  onGoToPage,
  loading = false,
}) => {
  const { currentPage, totalPages, totalItems, itemsPerPage, hasNextPage, hasPreviousPage } = pagination;

  // Calcular quais páginas mostrar
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Se temos poucas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas ao redor da atual
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      // Ajustar se estamos no início ou fim
      if (currentPage <= 3) {
        end = Math.min(totalPages, 5);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null; // Não mostrar paginação se há apenas uma página
  }

  return (
    <FooterContainer>
      <ItemsInfo>
        <ItemsInfoText>
          {totalItems > 0 ? `${startItem}-${endItem} de ${totalItems}` : 'Nenhum item'}
        </ItemsInfoText>
      </ItemsInfo>

      <PaginationContainer>
        {/* Botão Anterior */}
        <PageButton
          disabled={!hasPreviousPage || loading}
          onPress={onPreviousPage}
        >
          <PageButtonText disabled={!hasPreviousPage || loading}>‹</PageButtonText>
        </PageButton>

        {/* Primeira página (se não estiver visível) */}
        {visiblePages[0] > 1 && (
          <>
            <PageButton onPress={() => onGoToPage(1)} disabled={loading}>
              <PageButtonText disabled={loading}>1</PageButtonText>
            </PageButton>
            {visiblePages[0] > 2 && (
              <PageInfoText>...</PageInfoText>
            )}
          </>
        )}

        {/* Páginas visíveis */}
        {visiblePages.map((page) => (
          <PageButton
            key={page}
            variant={page === currentPage ? 'primary' : 'secondary'}
            onPress={() => onGoToPage(page)}
            disabled={loading}
          >
            <PageButtonText
              variant={page === currentPage ? 'primary' : 'secondary'}
              disabled={loading}
            >
              {page}
            </PageButtonText>
          </PageButton>
        ))}

        {/* Última página (se não estiver visível) */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <PageInfoText>...</PageInfoText>
            )}
            <PageButton onPress={() => onGoToPage(totalPages)} disabled={loading}>
              <PageButtonText disabled={loading}>{totalPages}</PageButtonText>
            </PageButton>
          </>
        )}

        {/* Botão Próximo */}
        <PageButton
          disabled={!hasNextPage || loading}
          onPress={onNextPage}
        >
          <PageButtonText disabled={!hasNextPage || loading}>›</PageButtonText>
        </PageButton>
      </PaginationContainer>

      <PageInfo>
        <PageInfoText>Página</PageInfoText>
        <PageInfoNumbers>{currentPage} de {totalPages}</PageInfoNumbers>
      </PageInfo>
    </FooterContainer>
  );
};

export default React.memo(PaginationFooter);

