// ** MUI Imports
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import WeatherNight from 'mdi-material-ui/WeatherNight'
import WeatherSunny from 'mdi-material-ui/WeatherSunny'

// ** Type Import
import { Settings } from '@core/context/settingsContext'
import PaletteMode from '@core/theme/PaletteMode'

interface Props {
    settings: Settings
    saveSettings: (values: Settings) => void
}

const ModeToggler = (props: Props) => {
    // ** Props
    const { settings, saveSettings } = props

    const handleModeChange = (mode: PaletteMode) => {
        saveSettings({ ...settings, mode })
    }

    const handleModeToggle = () => {
        if (settings.mode === 'light') {
            handleModeChange('dark')
        } else {
            handleModeChange('light')
        }
    }

    return (
        <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
            {settings.mode === 'dark' ? <WeatherSunny /> : <WeatherNight />}
        </IconButton>
    )
}

export default ModeToggler
