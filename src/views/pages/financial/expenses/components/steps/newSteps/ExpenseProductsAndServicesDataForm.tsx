import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { CondominiumService } from 'src/services/condominiumService'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MuiTextField from '@mui/material/TextField'
import { ItemType } from '@typesApiMapping/apps/condominium/itemTypes'
import Close from 'mdi-material-ui/Close'
import Plus from 'mdi-material-ui/Plus'
import { useState } from 'react'
import useDialog from 'src/hooks/useDialog'
import NewProduct from 'src/views/pages/parameters/product/NewProduct'
import NewService from 'src/views/pages/parameters/service/NewService'

import HomeSpaceMonetaryField from '@core/components/fields/HomespaceMonetaryField'
import TextField from '@mui/material/TextField'
import { NumericFormat } from 'react-number-format'

export type ExpenseProductsAndServicesDataForm = {
    items: {
        fk_item: string
        amount: number
        quantity: number
        unit_amount: number
        id?: string
        type: 'PRODUCT' | 'SERVICE'
    }[]
}

export default function ExpenseProductsAndServicesDataForm() {
    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext<ExpenseProductsAndServicesDataForm>()
    const { open } = useDialog()
    const [anchorMenuEl, setAnchorMenuEl] = useState<null | HTMLElement>(null)
    const openMenu = Boolean(anchorMenuEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorMenuEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorMenuEl(null)
    }

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    })

    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: () => CondominiumService.product.get().then(response => response.data),
        select: response => response.results,
        staleTime: 1000 * 60 * 5
    })

    const servicesQuery = useQuery({
        queryKey: ['services'],
        queryFn: () => CondominiumService.service.get().then(response => response.data),
        select: response => response.results,
        staleTime: 1000 * 60 * 5
    })

    const items = [
        ...(productsQuery.data || []).map(i => ({ ...i, type: 'PRODUCT' })),
        ...(servicesQuery.data || []).map(s => ({ ...s, type: 'SERVICE' }))
    ] as (ItemType & {
        type: 'PRODUCT' | 'SERVICE'
    })[]

    const selectableItems = items.filter(item => watch('items').findIndex(i => i.fk_item === item.id) === -1)


    return (
        <Box display='grid' gap={8}>
            <Box display='flex' alignItems='center'>
                <Autocomplete
                    onChange={(e, value) =>
                        append({
                            fk_item: value?.id,
                            amount: 0,
                            quantity: 0,
                            unit_amount: 0,
                            type: value?.type || 'PRODUCT'
                        })
                    }
                    sx={{ flexGrow: 1 }}
                    clearOnBlur={true}
                    options={selectableItems || []}
                    noOptionsText='Nenhum item disponível'
                    value={null}
                    getOptionLabel={(option: ItemType) => option.name}
                    renderInput={params => <MuiTextField {...params} label='Selecione um Produtos ou Serviço' />}
                    groupBy={option => ({ PRODUCT: 'Produtos', SERVICE: 'Serviços' }[option.type] || 'Produtos')}
                />
                <IconButton
                    id='new-item'
                    aria-controls={openMenu ? 'item-mune' : undefined}
                    aria-haspopup='true'
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <Plus />
                </IconButton>
                <Menu
                    id='item-mune'
                    anchorEl={anchorMenuEl}
                    open={openMenu}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'new-item'
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            open(onClose => <NewProduct onCancel={onClose} onConfirm={onClose} />)
                            handleClose()
                        }}
                    >
                        Novo Produto
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            open(onClose => <NewService onCancel={onClose} onConfirm={onClose} />)
                            handleClose()
                        }}
                    >
                        Novo Serviço
                    </MenuItem>
                </Menu>
            </Box>
            <Divider />
            {fields.map((field, index) => (
                <>
                    <Controller control={control} name={`items.${index}.id`} render={({ }) => <></>} />
                    <Box
                        key={field.id}
                        display='grid'
                        sx={{ gridTemplateColumns: '200px 1fr 1fr 1fr 40px', alignItems: 'center' }}
                        justifyContent='space-between'
                        gap={2}
                    >
                        <Box>
                            <Controller
                                control={control}
                                name={`items.${index}.fk_item`}
                                render={({ field }) => <>{items.find(item => item.id === field.value)?.name || '-'}</>}
                            />
                        </Box>
                        <Controller
                            control={control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                                <NumericFormat
                                    customInput={TextField}
                                    allowNegative={false}
                                    decimalScale={0}
                                    {...field}

                                    onValueChange={e => {
                                        console.log("e", e)
                                        const quantity = e.floatValue
                                        if (quantity === undefined) {
                                            return
                                        }

                                        const unitAmount = watch(`items.${index}.unit_amount`)
                                        const amount = quantity * unitAmount

                                        if (!isNaN(amount)) {
                                          setValue(`items.${index}.amount`, amount);
                                        }
                                    }}
                                    label='Quantidade'
                                    size='small'
                                    error={!!errors.items?.[index]?.quantity}
                                    helperText={errors.items?.[index]?.quantity?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={`items.${index}.unit_amount`}
                            render={({ field }) => (
                                <HomeSpaceMonetaryField
                                    {...field}

                                    onChange={(value) => {
                                      field.onChange(value); // Use the numeric value parsed by the HomeSpaceMonetaryField
                                      const quantity = watch(`items.${index}.quantity`);
                                      const amount = quantity * value; // Multiply quantity by unit amount

                                      if (!isNaN(amount)) {
                                        setValue(`items.${index}.amount`, amount);
                                      }
                                    }}

                                    label='Valor Unitário'
                                    error={!!errors.items?.[index]?.unit_amount}
                                    helperText={errors.items?.[index]?.unit_amount?.message}

                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={`items.${index}.amount`}
                            rules={{ required: 'Campo obrigatório', min: { value: 0.01, message: 'Valor inválido' } }}
                            render={({ field }) => (
                              <HomeSpaceMonetaryField
                                    {...field}

                                    onChange={(value) => {
                                      field.onChange(value); // Use the numeric value parsed by the HomeSpaceMonetaryField
                                      const quantity = watch(`items.${index}.quantity`);
                                      const unitaryAmount = value / quantity; // Divide amount by quantity

                                      if (!isNaN(unitaryAmount)) {
                                        setValue(`items.${index}.unit_amount`, unitaryAmount);
                                      }
                                    }}

                                    label='Valor Total'
                                    error={!!errors.items?.[index]?.amount}
                                    helperText={errors.items?.[index]?.amount?.message}
                                />
                            )}
                        />
                        <IconButton onClick={() => remove(index)}>
                            <Close />
                        </IconButton>
                    </Box>
                </>
            ))}
        </Box>
    )
}
