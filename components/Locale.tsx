import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';

type StyleProps = {
  selected?: boolean;
}

const LocaleItem = styled.span<StyleProps>`
  font-weight: 600;
  ${props => props.selected && css`border-bottom: 1px solid ${props.theme.secondaryLight};`}
  margin: 4px;
  text-transform: uppercase;
  cursor: pointer;
`

const Locale = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router
  return (
    <div>
      {router.locales?.map(locale => (
        <LocaleItem
          key={locale}
          selected={router.locale === locale}
          onClick={() => router.push({ pathname, query }, asPath, { locale, })}>
          {locale}
      </LocaleItem>
      ))}
    </div>
  )
}

export default Locale;