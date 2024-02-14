import styles from '@/styles/testAuth.module.css'

type FormErrorProps = {
    message?: string;
}

export const FormError = ({
  message
}: FormErrorProps) => {

  if (!message) {
    return null;
  }

  return (
    <div className={styles.formError}>
      <p> {message} </p>
    </div>
  )
}
