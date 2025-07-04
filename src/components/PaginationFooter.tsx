import React from 'react';
import { PaginationInfo } from '../store/slices/observationSlice';
import { FooterContainer, PaginationContainer, PageButton, PageButtonText } from '../styles/components/paginationFooter';
import Icon from '@react-native-vector-icons/fontawesome';

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
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

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

  if (totalPages <= 1) {
    return null; // Não mostrar paginação se há apenas uma página
  }

  return (
    <FooterContainer>

      <PaginationContainer>
        {/* Botão Anterior */}
        <PageButton
          disabled={!hasPreviousPage || loading}
          onPress={onPreviousPage}
        >
          <Icon name='arrow-left' size={20} color="white" />
        </PageButton>

        {/* Primeira página (se não estiver visível) */}
        {visiblePages[0] > 1 && (
          <>
            <PageButton onPress={() => onGoToPage(1)} disabled={loading}>
              <PageButtonText disabled={loading}>1</PageButtonText>
            </PageButton>
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
          <Icon name='arrow-right' size={20} color="white" />
        </PageButton>
      </PaginationContainer>
    </FooterContainer>
  );
};

export default React.memo(PaginationFooter);

