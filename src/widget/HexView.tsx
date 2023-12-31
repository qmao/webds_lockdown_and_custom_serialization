import React, { useState, useEffect, useRef } from 'react';

import {
    Stack,
    Typography,
    Input,
    ToggleButton,
    ToggleButtonGroup,
    IconButton
} from '@mui/material';

import { webdsService } from './local_exports';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

const BLOCK_WIDTH = 40;
const BLOCK_HEIGHT = 25;
const TITLE_WIDTH = 90;

function ToggleButtons(props: any) {
    const [alignment, setAlignment] = React.useState<string | null>('ascii');

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null
    ) => {
        setAlignment(newAlignment);

        if (newAlignment === 'ascii') {
            props.onChange(true);
        } else {
            props.onChange(false);
        }
    };

    return (
        <Stack alignItems="center" sx={{ width: '100%', pb: 2 }}>
            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
                size="small"
                sx={{ width: 30, height: 30 }}
            >
                <ToggleButton value="hex" aria-label="left aligned">
                    <Typography fontSize={12}> Hex</Typography>
                </ToggleButton>
                <ToggleButton value="ascii" aria-label="centered">
                    <Typography fontSize={12}> ASCII</Typography>
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    );
}

const LoadInputCharacter = (props: any) => {
    const onValueChange = (value: any) => {
        console.log('value?', value);
        if (value.length > 2) {
            console.log('invalid');
        }
        if (value.length < 1) {
            props.onChange(0);
        } else {
            // Convert the input to a decimal number
            let text: any = '';
            if (props.ascii) {
                // Convert the input to a decimal number
                text = value.charCodeAt(0);
            } else {
                text = value;
            }
            props.onChange(text);
        }
    };

    const getChar = (value: any) => {
        switch (value) {
            case 0:
                if (props.ascii) {
                    return '';
                } else {
                    return '00';
                }
            default:
                if (props.ascii) {
                    return String.fromCharCode(value);
                } else {
                    return value.toString(16).toUpperCase();
                }
        }
    };

    return (
        <Input
            readOnly={props.readOnly}
            value={getChar(props.data)}
            sx={{
                width: BLOCK_WIDTH,
                height: BLOCK_HEIGHT,
                textAlign: 'center',
                //':before': { borderBottomColor: 'white' },
                // underline when selected
                //':after': { borderBottomColor: webdsTheme.palette.primary.main },
                '& input': {
                    textAlign: 'center',
                    fontSize: 12
                }
            }}
            key={'character' + props.index}
            onChange={(e: any) => onValueChange(e.target.value)}
        />
    );
};

export const HexView = (props: any): JSX.Element => {
    const data = useRef(
        props.value
    ); /*useState(
    Array.from({ length: 0x80 }, (_, i) => Math.round(i / 50))
  );*/
    const [isReady, setReady] = useState(false);
    const [isAscii, setAscii] = useState(true);
    const [empty, setEmpty] = useState([]);
    const [table, setTable] = useState(Array.from({ length: 0x60 }, () => 0));
    const [focus, setFocus] = React.useState(-1);
    const offset = useRef(0);
    const [disableTop, setDisableTop] = useState(false);
    const [disableBottom, setDisableBottom] = useState(false);
    const [disablePrev, setDisablePrev] = useState(false);
    const [disableNext, setDisableNext] = useState(false);
    const lastPageOffset = useRef(0);

    const rows = 10; //Math.ceil(data.length / ROW_MAX); // Calculate the number of rows
    const DATA_COUNT = rows * props.rowWidth;

    enum Scroll {
        top = 0,
        prev = 1,
        next = 2,
        bottom = 3
    }
    const CheckEmpty = (dataList: any) => {
        // Split the array into subgroups of 8 bytes
        let all: any = [];
        for (let i = 0; i < dataList.length; i += props.rowWidth) {
            let subgroups: any = dataList.slice(i, i + props.rowWidth);
            let isZero: any = subgroups.every((element: number) => element === 0);
            if (isZero) {
                all[i / props.rowWidth] = true;
            } else {
                all[i / props.rowWidth] = false;
            }
            setEmpty(all);
        }
        //console.log('Empty Block', all);
    };

    function getLastPageFirstOffset() {
        let lastPage: any = Math.floor(data.current.length / DATA_COUNT);
        let lastPageExtra: any = data.current.length % DATA_COUNT === 0 ? 0 : 1;
        let index: any = (lastPage + lastPageExtra - 1) * rows;
        return index;
    }

    const init = () => {
        data.current = props.value;
        let start: any = offset.current * props.rowWidth;
        let update: any = data.current.slice(start, start + DATA_COUNT + 1);
        setTable(update);

        lastPageOffset.current = getLastPageFirstOffset();
        CheckEmpty(data.current);
        checkButtonState();
        setReady(true);
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (props.ui.checkEmptyBlock) {
            init();
            let update: any = { ...props.ui };
            update.checkEmptyBlock = false;
            props.onUpdate(update);
        }
    }, [props.ui]);

    const handleHoverEnter = (row: number, index: number) => {
        setFocus(row * props.rowWidth + index);
        // Handle hover enter logic for the specific component
    };

    const handleHoverLeave = (row: number, index: number) => {
        setFocus(-1);
        // Handle hover leave logic for the specific component
    };

    const onDataChange = (index: any, value: any) => {
        let newData: any = [...table];
        let num: any;
        if (isAscii) {
            num = Number(value);
        } else {
            num = parseInt(value, 16);
            if (isNaN(num) && value !== '') {
                return;
            }
            if (num > 0xff) {
                return;
            }
        }
        newData[index] = num;
        setTable(newData);
        data.current[offset.current * props.rowWidth + index] = num;
        props.onChange(data.current);
    };

    function checkButtonState() {
        let last: any = lastPageOffset.current;
        if (offset.current === 0) {
            setDisableTop(true);
            setDisablePrev(true);
            setDisableBottom(false);
            setDisableNext(false);
        } else if (offset.current === last) {
            setDisableTop(false);
            setDisablePrev(false);
            setDisableBottom(true);
            setDisableNext(true);
        } else {
            setDisableTop(false);
            setDisablePrev(false);
            setDisableBottom(false);
            setDisableNext(false);
        }
    }
    const ScrollUi = (s: any) => {
        let last: any = lastPageOffset.current;

        switch (s) {
            case Scroll.top:
                offset.current = 0;
                break;
            case Scroll.bottom:
                offset.current = last;
                break;
            case Scroll.prev:
                if (offset.current >= rows) {
                    offset.current = offset.current - rows;
                }
                break;
            case Scroll.next:
                if (offset.current + rows >= last) {
                    offset.current = last;
                } else {
                    offset.current = offset.current + rows;
                }
                break;
        }

        let start: any = offset.current * props.rowWidth;
        let update = data.current.slice(start, start + DATA_COUNT + 1);
        setTable(update);

        checkButtonState();
    };

    const onFormatChange = (ascii: any) => {
        setAscii(ascii);
    };

    const webdsTheme = webdsService.ui.getWebDSTheme();

    function LoadArrows() {
        return (
            <Stack sx={{ position: 'relative' }}>
                <Stack
                    direction="column"
                    spacing={1}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: -50,
                        transform: 'translateY(50%)'
                    }}
                >
                    <IconButton
                        disabled={disableTop}
                        sx={{ color: 'primary.main' }}
                        onClick={() => ScrollUi(Scroll.top)}
                    >
                        <KeyboardDoubleArrowUpIcon />
                    </IconButton>

                    <IconButton
                        disabled={disablePrev}
                        sx={{ color: 'primary.main' }}
                        onClick={() => ScrollUi(Scroll.prev)}
                    >
                        <KeyboardArrowDownIcon
                            sx={{
                                transform: 'rotate(180deg)'
                            }}
                        />
                    </IconButton>
                    <IconButton
                        disabled={disableNext}
                        sx={{ color: 'primary.main' }}
                        onClick={() => ScrollUi(Scroll.next)}
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    <IconButton
                        disabled={disableBottom}
                        sx={{ color: 'primary.main' }}
                        onClick={() => ScrollUi(Scroll.bottom)}
                    >
                        <KeyboardDoubleArrowUpIcon
                            sx={{
                                transform: 'rotate(180deg)'
                            }}
                        />
                    </IconButton>
                </Stack>
            </Stack>
        );
    }

    return (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
        >
            {isReady && (
                <>
                    <Stack direction="column" sx={{ position: 'relative' }}>
                        {LoadArrows()}
                        <ToggleButtons onChange={onFormatChange} />
                        <Stack direction="row" justifyContent="center" alignItems="center">
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                sx={{
                                    width: TITLE_WIDTH,
                                    height: BLOCK_HEIGHT,
                                    backgroundColor: 'primary.main',
                                    border: 1,
                                    borderColor: webdsTheme.palette.section.border
                                }}
                            >
                                <Typography
                                    sx={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 14
                                    }}
                                >
                                    Offset (h)
                </Typography>
                            </Stack>
                            {Array.from(Array(props.rowWidth).keys()).map(
                                (d: any, index: number) => (
                                    <Stack
                                        key={'title' + index.toString()}
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{
                                            width: BLOCK_WIDTH,
                                            height: BLOCK_HEIGHT,
                                            backgroundColor: 'primary.main',
                                            border: 1,
                                            borderColor: webdsTheme.palette.section.border
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textAlign: 'center',
                                                color: 'white',
                                                fontSize: 12
                                            }}
                                        >
                                            {d.toString(16).toUpperCase().padStart(2, '0')}
                                        </Typography>
                                    </Stack>
                                )
                            )}
                        </Stack>

                        <Stack direction="column">
                            {Array.from(Array(rows), (_, rowIndex) => (
                                <Stack direction="row" key={rowIndex} spacing={0}>
                                    <Stack
                                        key={'stack1' + rowIndex}
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{
                                            height: BLOCK_HEIGHT,
                                            width: TITLE_WIDTH,
                                            border: 1,
                                            borderColor: 'white',
                                            backgroundColor: webdsTheme.palette.section.border
                                        }}
                                    >
                                        <Typography
                                            key={'Typography1' + rowIndex}
                                            sx={{
                                                fontSize: 12,
                                                textAlign: 'center'
                                            }}
                                        >
                                            {((rowIndex + offset.current) * props.rowWidth)
                                                .toString(16)
                                                .toUpperCase()
                                                .padStart(8, '0')}
                                        </Typography>
                                    </Stack>

                                    <Stack
                                        key={'Stack2' + rowIndex}
                                        sx={{
                                            pointerEvents:
                                                empty[rowIndex + offset.current] === false ||
                                                    props.readOnly
                                                    ? 'none'
                                                    : ''
                                        }}
                                        direction="row"
                                    >
                                        {table
                                            .slice(
                                                rowIndex * props.rowWidth,
                                                (rowIndex + 1) * props.rowWidth
                                            )
                                            .map((d: any, index: number) => (
                                                <Stack
                                                    key={'stack' + index}
                                                    onMouseEnter={() => handleHoverEnter(rowIndex, index)}
                                                    onMouseLeave={() => handleHoverLeave(rowIndex, index)}
                                                    sx={{
                                                        border: 1,
                                                        borderColor: webdsTheme.palette.section.background,
                                                        backgroundColor:
                                                            empty[rowIndex + offset.current] === false &&
                                                                !props.readOnly
                                                                ? webdsTheme.palette.section.background
                                                                : 'default'
                                                    }}
                                                >
                                                    <LoadInputCharacter
                                                        readOnly={props.readOnly}
                                                        ascii={isAscii}
                                                        data={d}
                                                        focus={focus}
                                                        rowWidth={props.rowWidth}
                                                        onChange={(e: any) =>
                                                            onDataChange(rowIndex * props.rowWidth + index, e)
                                                        }
                                                    />
                                                </Stack>
                                            ))}
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                </>
            )}
        </Stack>
    );
};

export default HexView;
