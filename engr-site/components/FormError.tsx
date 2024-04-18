import styles from '@/styles/form.module.css'

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
